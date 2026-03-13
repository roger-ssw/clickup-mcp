import { z } from 'zod';

export function registerTaskTools(server, getClient) {
  // --- Read ---
  server.tool(
    'clickup_getTasks',
    'Get tasks from a list (with optional filters)',
    {
      list_id: z.string().describe('List ID'),
      archived: z.boolean().optional().describe('Include archived tasks'),
      page: z.number().optional().describe('Page number (0-indexed)'),
      order_by: z.string().optional().describe('Order by: id, created, updated, due_date'),
      reverse: z.boolean().optional().describe('Reverse sort order'),
      subtasks: z.boolean().optional().describe('Include subtasks'),
      statuses: z.array(z.string()).optional().describe('Filter by status names'),
      include_closed: z.boolean().optional().describe('Include closed tasks'),
      assignees: z.array(z.string()).optional().describe('Filter by assignee IDs'),
      due_date_gt: z.number().optional().describe('Due date greater than (Unix ms)'),
      due_date_lt: z.number().optional().describe('Due date less than (Unix ms)'),
    },
    async ({ list_id, ...params }) => {
      const client = getClient();
      const data = await client.get(`/list/${list_id}/task`, params);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_getTask',
    'Get a single task by ID',
    {
      task_id: z.string().describe('Task ID'),
      include_subtasks: z.boolean().optional().describe('Include subtasks'),
    },
    async ({ task_id, include_subtasks }) => {
      const client = getClient();
      const params = {};
      if (include_subtasks) params.include_subtasks = include_subtasks;
      const data = await client.get(`/task/${task_id}`, params);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // --- Create ---
  server.tool(
    'clickup_createTask',
    'Create a new task in a list',
    {
      list_id: z.string().describe('List ID to create the task in'),
      name: z.string().describe('Task name'),
      description: z.string().optional().describe('Task description (markdown supported)'),
      assignees: z.array(z.number()).optional().describe('Array of user IDs to assign'),
      tags: z.array(z.string()).optional().describe('Array of tag names'),
      status: z.string().optional().describe('Status name'),
      priority: z.number().optional().nullable().describe('Priority: 1=urgent, 2=high, 3=normal, 4=low, null=none'),
      due_date: z.number().optional().describe('Due date as Unix timestamp in ms'),
      due_date_time: z.boolean().optional().describe('Whether due_date includes time'),
      start_date: z.number().optional().describe('Start date as Unix timestamp in ms'),
      start_date_time: z.boolean().optional().describe('Whether start_date includes time'),
      time_estimate: z.number().optional().describe('Time estimate in ms'),
      notify_all: z.boolean().optional().describe('Notify all assignees'),
      parent: z.string().optional().nullable().describe('Parent task ID for subtasks'),
      links_to: z.string().optional().nullable().describe('Task ID to link to'),
      check_required_custom_fields: z.boolean().optional().describe('Validate required custom fields'),
      custom_fields: z.array(z.object({
        id: z.string(),
        value: z.any(),
      })).optional().describe('Custom field values'),
    },
    async ({ list_id, ...taskData }) => {
      const client = getClient();
      const data = await client.post(`/list/${list_id}/task`, taskData);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // --- Update ---
  server.tool(
    'clickup_updateTask',
    'Update an existing task',
    {
      task_id: z.string().describe('Task ID'),
      name: z.string().optional().describe('New task name'),
      description: z.string().optional().describe('New description'),
      status: z.string().optional().describe('New status name'),
      priority: z.number().optional().nullable().describe('Priority: 1=urgent, 2=high, 3=normal, 4=low, null=none'),
      due_date: z.number().optional().nullable().describe('Due date as Unix timestamp in ms (null to clear)'),
      due_date_time: z.boolean().optional().describe('Whether due_date includes time'),
      start_date: z.number().optional().nullable().describe('Start date as Unix timestamp in ms (null to clear)'),
      start_date_time: z.boolean().optional().describe('Whether start_date includes time'),
      time_estimate: z.number().optional().nullable().describe('Time estimate in ms'),
      assignees: z.object({
        add: z.array(z.number()).optional(),
        rem: z.array(z.number()).optional(),
      }).optional().describe('Add/remove assignees by user ID'),
      archived: z.boolean().optional().describe('Archive or unarchive'),
      parent: z.string().optional().nullable().describe('Move to subtask of parent (null to make top-level)'),
    },
    async ({ task_id, ...updates }) => {
      const client = getClient();
      const data = await client.put(`/task/${task_id}`, updates);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // --- Delete ---
  server.tool(
    'clickup_deleteTask',
    'Delete a task',
    { task_id: z.string().describe('Task ID') },
    async ({ task_id }) => {
      const client = getClient();
      const data = await client.delete(`/task/${task_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // --- Move task to another list ---
  server.tool(
    'clickup_moveTask',
    'Move a task to a different list',
    {
      task_id: z.string().describe('Task ID'),
      list_id: z.string().describe('Destination list ID'),
    },
    async ({ task_id, list_id }) => {
      const client = getClient();
      const data = await client.put(`/task/${task_id}`, { list: { id: list_id } });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  // --- Set custom field ---
  server.tool(
    'clickup_setCustomFieldValue',
    'Set a custom field value on a task',
    {
      task_id: z.string().describe('Task ID'),
      field_id: z.string().describe('Custom field ID'),
      value: z.any().optional().describe('Field value (type depends on the field)'),
    },
    async ({ task_id, field_id, value }) => {
      const client = getClient();
      const data = await client.post(`/task/${task_id}/field/${field_id}`, { value });
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
