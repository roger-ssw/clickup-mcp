import { z } from 'zod';

export function registerSpaceTools(server, getClient) {
  server.tool(
    'clickup_getSpaces',
    'List all spaces in a workspace',
    { team_id: z.string().describe('Workspace (team) ID') },
    async ({ team_id }) => {
      const client = getClient();
      const data = await client.get(`/team/${team_id}/space`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createSpace',
    'Create a new space in a workspace',
    {
      team_id: z.string().describe('Workspace (team) ID'),
      name: z.string().describe('Space name'),
      multiple_assignees: z.boolean().optional().describe('Allow multiple assignees'),
      features: z.object({}).passthrough().optional().describe('Feature toggles (due_dates, time_tracking, etc.)'),
    },
    async ({ team_id, name, multiple_assignees, features }) => {
      const client = getClient();
      const body = { name };
      if (multiple_assignees !== undefined) body.multiple_assignees = multiple_assignees;
      if (features) body.features = features;
      const data = await client.post(`/team/${team_id}/space`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_updateSpace',
    'Update an existing space',
    {
      space_id: z.string().describe('Space ID'),
      name: z.string().optional().describe('New space name'),
      color: z.string().optional().describe('Space color hex'),
      private: z.boolean().optional().describe('Make space private'),
      multiple_assignees: z.boolean().optional().describe('Allow multiple assignees'),
    },
    async ({ space_id, ...updates }) => {
      const client = getClient();
      const data = await client.put(`/space/${space_id}`, updates);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_deleteSpace',
    'Delete a space',
    { space_id: z.string().describe('Space ID') },
    async ({ space_id }) => {
      const client = getClient();
      const data = await client.delete(`/space/${space_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
