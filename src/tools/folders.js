import { z } from 'zod';

export function registerFolderTools(server, getClient) {
  server.tool(
    'clickup_getFolders',
    'List all folders in a space',
    { space_id: z.string().describe('Space ID') },
    async ({ space_id }) => {
      const client = getClient();
      const data = await client.get(`/space/${space_id}/folder`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createFolder',
    'Create a new folder in a space',
    {
      space_id: z.string().describe('Space ID'),
      name: z.string().describe('Folder name'),
    },
    async ({ space_id, name }) => {
      const client = getClient();
      const data = await client.post(`/space/${space_id}/folder`, { name });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_updateFolder',
    'Update a folder name',
    {
      folder_id: z.string().describe('Folder ID'),
      name: z.string().describe('New folder name'),
    },
    async ({ folder_id, name }) => {
      const client = getClient();
      const data = await client.put(`/folder/${folder_id}`, { name });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_deleteFolder',
    'Delete a folder',
    { folder_id: z.string().describe('Folder ID') },
    async ({ folder_id }) => {
      const client = getClient();
      const data = await client.delete(`/folder/${folder_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
