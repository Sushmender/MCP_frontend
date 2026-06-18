import { apiClient } from './client';
import type { ChatResponse } from '@/types/api.types';

/**
 * Send a free-form natural-language query to the LLM.
 * The model autonomously decides which MCP tools to call.
 */
export const chatApi = {
  sendMessage: (message: string) =>
    apiClient.post<ChatResponse>('/api/chat', { message }),
};
