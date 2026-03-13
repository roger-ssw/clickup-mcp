const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;

export class ClickUpClient {
  constructor({ apiToken, baseUrl }) {
    if (!apiToken) {
      throw new Error('ClickUp API token is required. Set CLICKUP_API_TOKEN env var.');
    }
    this.apiToken = apiToken;
    this.baseUrl = (baseUrl || 'https://api.clickup.com/api/v2').replace(/\/$/, '');
  }

  async request(method, path, { params, body } = {}) {
    let url = `${this.baseUrl}${path}`;

    if (params && method === 'GET') {
      const qs = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        if (Array.isArray(value)) {
          value.forEach(v => qs.append(key + '[]', String(v)));
        } else {
          qs.set(key, String(value));
        }
      }
      const qsStr = qs.toString();
      if (qsStr) url += `?${qsStr}`;
    }

    const headers = {
      'Authorization': this.apiToken,
      'Content-Type': 'application/json',
    };

    let lastError;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const fetchOpts = { method, headers };
        if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          fetchOpts.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOpts);

        if (response.status === 429 && attempt < MAX_RETRIES) {
          const delay = RETRY_BASE_MS * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        if (!response.ok) {
          const msg = typeof data === 'object' ? JSON.stringify(data) : data;
          throw new Error(`ClickUp API ${response.status}: ${msg}`);
        }

        return data;
      } catch (err) {
        lastError = err;
        if (err.message?.includes('ClickUp API') || attempt >= MAX_RETRIES) throw err;
        const delay = RETRY_BASE_MS * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  }

  async get(path, params) { return this.request('GET', path, { params }); }
  async post(path, body) { return this.request('POST', path, { body }); }
  async put(path, body) { return this.request('PUT', path, { body }); }
  async delete(path) { return this.request('DELETE', path); }
}
