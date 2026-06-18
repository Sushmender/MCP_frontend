import { useMutation } from '@tanstack/react-query';
import { promptsApi } from '@/api/prompts.api';
import { useWorkflowStore } from '@/store/workflow.store';
import { parseApiError } from '@/utils/errorParser';
import type { ExecutePromptResponse } from '@/types/api.types';

interface ExecuteWorkflowArgs {
  promptName: string;
  args: Record<string, unknown>;
}

/** Manages executing a named research workflow prompt. */
export function useWorkflow() {
  const { setResult, setLoading, setError } = useWorkflowStore();

  const mutation = useMutation({
    mutationFn: ({ promptName, args }: ExecuteWorkflowArgs) =>
      promptsApi.execute(promptName, args).then((r) => r.data),

    onMutate: () => {
      setLoading(true);
      setError(null);
      setResult(null);
    },

    onSuccess: (data: ExecutePromptResponse) => {
      setLoading(false);
      setResult({
        promptName: data.prompt_name,
        response: data.response,
        toolCalls: data.tool_calls,
      });
    },

    onError: (error: unknown) => {
      setLoading(false);
      setError(parseApiError(error));
    },
  });

  return {
    execute: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
