import { apiClient } from './client';
import type {
  PromptsResponse,
  ExecutePromptResponse,
} from '@/types/api.types';

/** List all named prompt templates registered by MCP servers. */
export const promptsApi = {
  list: () => apiClient.get<PromptsResponse>('/api/prompts'),

  /**
   * Execute a named MCP prompt template.
   * @param promptName - Must match a value from GET /api/prompts
   * @param args - Key-value pairs matching the prompt's declared arguments
   */
  execute: (promptName: string, args: Record<string, unknown>) =>
    apiClient.post<ExecutePromptResponse>('/api/prompts/execute', {
      prompt_name: promptName,
      arguments: args,
    }),
};
