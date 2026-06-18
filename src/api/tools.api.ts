import { apiClient } from './client';
import type { ToolsResponse } from '@/types/api.types';

/** List all tools registered across every connected MCP server. */
export const toolsApi = {
  list: () => apiClient.get<ToolsResponse>('/api/tools'),
};
