#!/usr/bin/env node

import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ClickUpClient } from './client.js';

// Tool registrations
import { registerWorkspaceTools } from './tools/workspaces.js';
import { registerSpaceTools } from './tools/spaces.js';
import { registerFolderTools } from './tools/folders.js';
import { registerListTools } from './tools/lists.js';
import { registerTaskTools } from './tools/tasks.js';
import { registerCommentTools } from './tools/comments.js';
import { registerTagTools } from './tools/tags.js';

const apiToken = process.env.CLICKUP_API_TOKEN || '';

const server = new McpServer(
  { name: 'clickup-mcp', version: '1.0.0' },
);

function getClient() {
  return new ClickUpClient({
    apiToken,
    baseUrl: process.env.CLICKUP_API_BASE_URL || 'https://api.clickup.com/api/v2',
  });
}

// Register all tools
registerWorkspaceTools(server, getClient);
registerSpaceTools(server, getClient);
registerFolderTools(server, getClient);
registerListTools(server, getClient);
registerTaskTools(server, getClient);
registerCommentTools(server, getClient);
registerTagTools(server, getClient);

// Error handling
server.onerror = (error) => {
  console.error('[clickup-mcp error]', error);
};

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

// Start
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('clickup-mcp server running on stdio');
