import { z } from 'zod';

export function registerCommentTools(server, getClient) {
  server.tool(
    'clickup_getTaskComments',
    'Get comments on a task',
    {
      task_id: z.string().describe('Task ID'),
      start: z.number().optional().describe('Start offset'),
      start_id: z.string().optional().describe('Start from comment ID'),
    },
    async ({ task_id, ...params }) => {
      const client = getClient();
      const data = await client.get(`/task/${task_id}/comment`, params);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createTaskComment',
    'Add a comment to a task',
    {
      task_id: z.string().describe('Task ID'),
      comment_text: z.string().describe('Comment body (plain text)'),
      assignee: z.number().optional().describe('User ID to assign in comment'),
      notify_all: z.boolean().optional().describe('Notify all assignees'),
    },
    async ({ task_id, comment_text, assignee, notify_all }) => {
      const client = getClient();
      const body = { comment_text };
      if (assignee) body.assignee = assignee;
      if (notify_all !== undefined) body.notify_all = notify_all;
      const data = await client.post(`/task/${task_id}/comment`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_createListComment',
    'Add a comment to a list',
    {
      list_id: z.string().describe('List ID'),
      comment_text: z.string().describe('Comment body (plain text)'),
      assignee: z.number().optional().describe('User ID to assign in comment'),
    },
    async ({ list_id, comment_text, assignee }) => {
      const client = getClient();
      const body = { comment_text };
      if (assignee) body.assignee = assignee;
      const data = await client.post(`/list/${list_id}/comment`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_updateComment',
    'Update an existing comment',
    {
      comment_id: z.string().describe('Comment ID'),
      comment_text: z.string().describe('Updated comment body'),
      assignee: z.number().optional().describe('New assignee user ID'),
      resolved: z.boolean().optional().describe('Mark comment as resolved'),
    },
    async ({ comment_id, comment_text, assignee, resolved }) => {
      const client = getClient();
      const body = { comment_text };
      if (assignee) body.assignee = assignee;
      if (resolved !== undefined) body.resolved = resolved;
      const data = await client.put(`/comment/${comment_id}`, body);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    'clickup_deleteComment',
    'Delete a comment',
    { comment_id: z.string().describe('Comment ID') },
    async ({ comment_id }) => {
      const client = getClient();
      const data = await client.delete(`/comment/${comment_id}`);
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );
}
