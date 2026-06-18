import { useQuery } from '@tanstack/react-query';
import { toolsApi } from '@/api/tools.api';
import { promptsApi } from '@/api/prompts.api';
import { resourcesApi } from '@/api/resources.api';

const STALE = 5 * 60 * 1000; // 5 minutes

/** Fetches the list of all MCP tools. */
export function useTools() {
  return useQuery({
    queryKey: ['tools'],
    queryFn: () => toolsApi.list().then((r) => r.data.tools),
    staleTime: STALE,
  });
}

/** Fetches the list of all named prompt templates. */
export function usePrompts() {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: () => promptsApi.list().then((r) => r.data.prompts),
    staleTime: STALE,
  });
}

/** Fetches the list of all static resources and templates. */
export function useResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesApi.list().then((r) => r.data),
    staleTime: STALE,
  });
}
