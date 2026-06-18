import { apiClient } from './client';
import type { HealthResponse } from '@/types/api.types';

/** Health check — returns status of the MCP backend service. */
export const healthApi = {
  check: () => apiClient.get<HealthResponse>('/'),
};
