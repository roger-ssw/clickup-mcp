import { z } from 'zod';

export function registerTagTools(server, getClient) {
  server.tool(
    'clickup_getSpaceTags',
    'Get all tags in a space',
    { space_id: z.string().describe('Space ID') },
    async ({ space_id }) => {
      const client = getClient();
      const data = await client.get(`/space/${space_id}/tag`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createSpaceTag',
    'Create a tag in a space',
    {
      space_id: z.string().describe('Space ID'),
      name: z.string().describe('Tag name'),
      tag_fg: z.string().optional().describe('Foreground color hex'),
      tag_bg: z.string().optional().describe('Background color hex'),
    },
    async ({ space_id, name, tag_fg, tag_bg }) => {
      const client = getClient();
      const tag = { name };
      if (tag_fg) tag.tag_fg = tag_fg;
      if (tag_bg) tag.tag_bg = tag_bg;
      const data = await client.post(`/space/${space_id}/tag`, { tag });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_addTagToTask',
    'Add a tag to a task',
    {
      task_id: z.string().describe('Task ID'),
      tag_name: z.string().describe('Tag name to add'),
    },
    async ({ task_id, tag_name }) => {
      const client = getClient();
      const data = await client.post(`/task/${task_id}/tag/${tag_name}`, {});
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_removeTagFromTask',
    'Remove a tag from a task',
    {
      task_id: z.string().describe('Task ID'),
      tag_name: z.string().describe('Tag name to remove'),
    },
    async ({ task_id, tag_name }) => {
      const client = getClient();
      const data = await client.delete(`/task/${task_id}/tag/${tag_name}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
