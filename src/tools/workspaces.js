import { z } from 'zod';

export function registerWorkspaceTools(server, getClient) {
  server.tool(
    'clickup_getWorkspaces',
    'List all workspaces (teams) the authenticated user belongs to',
    {},
    async () => {
      const client = getClient();
      const data = await client.get('/team');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_getAuthorizedUser',
    'Get details of the authenticated user',
    {},
    async () => {
      const client = getClient();
      const data = await client.get('/user');
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
