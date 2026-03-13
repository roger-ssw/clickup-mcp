import { z } from 'zod';

export function registerListTools(server, getClient) {
  server.tool(
    'clickup_getLists',
    'List all lists in a folder',
    { folder_id: z.string().describe('Folder ID') },
    async ({ folder_id }) => {
      const client = getClient();
      const data = await client.get(`/folder/${folder_id}/list`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_getFolderlessLists',
    'List all folderless lists in a space',
    { space_id: z.string().describe('Space ID') },
    async ({ space_id }) => {
      const client = getClient();
      const data = await client.get(`/space/${space_id}/list`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createList',
    'Create a new list in a folder',
    {
      folder_id: z.string().describe('Folder ID'),
      name: z.string().describe('List name'),
      content: z.string().optional().describe('List description'),
      due_date: z.number().optional().describe('Due date as Unix timestamp in ms'),
      priority: z.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
      status: z.string().optional().describe('Status to assign'),
    },
    async ({ folder_id, name, content, due_date, priority, status }) => {
      const client = getClient();
      const body = { name };
      if (content) body.content = content;
      if (due_date) body.due_date = due_date;
      if (priority) body.priority = priority;
      if (status) body.status = status;
      const data = await client.post(`/folder/${folder_id}/list`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createFolderlessList',
    'Create a folderless list directly in a space',
    {
      space_id: z.string().describe('Space ID'),
      name: z.string().describe('List name'),
      content: z.string().optional().describe('List description'),
      due_date: z.number().optional().describe('Due date as Unix timestamp in ms'),
      priority: z.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
      status: z.string().optional().describe('Status to assign'),
    },
    async ({ space_id, name, content, due_date, priority, status }) => {
      const client = getClient();
      const body = { name };
      if (content) body.content = content;
      if (due_date) body.due_date = due_date;
      if (priority) body.priority = priority;
      if (status) body.status = status;
      const data = await client.post(`/space/${space_id}/list`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_updateList',
    'Update an existing list',
    {
      list_id: z.string().describe('List ID'),
      name: z.string().optional().describe('New list name'),
      content: z.string().optional().describe('New list description'),
      due_date: z.number().optional().describe('Due date as Unix timestamp in ms'),
      priority: z.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
      status: z.string().optional().describe('Status to assign'),
    },
    async ({ list_id, ...updates }) => {
      const client = getClient();
      const data = await client.put(`/list/${list_id}`, updates);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_deleteList',
    'Delete a list',
    { list_id: z.string().describe('List ID') },
    async ({ list_id }) => {
      const client = getClient();
      const data = await client.delete(`/list/${list_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
