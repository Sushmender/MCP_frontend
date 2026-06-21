import { useMutation } from '@tanstack/react-query';
import { promptsApi } from '@/api/prompts.api';
import { chatApi } from '@/api/chat.api';
import { useWorkflowStore } from '@/store/workflow.store';
import { parseApiError, isServiceUnavailable } from '@/utils/errorParser';
import type { ChatResponse, ExecutePromptResponse } from '@/types/api.types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/store/toast.store';

interface ExecuteWorkflowArgs {
  promptName: string;
  args: Record<string, unknown>;
}

interface FetchWorkflowArgs {
  url: string;
}

/** Manages executing a named research workflow prompt. */
export function useWorkflow() {
  const { setResult, setLoading, setError } = useWorkflowStore();
  const navigate = useNavigate();

  // ── Prompt-based workflows (summarize / compare / find_and_summarize) ────────
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
      const message = parseApiError(error);
      toast.error(message);
      if (isServiceUnavailable(error)) {
        navigate('/service-error');
      }
      setError(message);
    },
  });

  // ── Fetch workflow — forwards URL to the chat LLM ────────────────────────────
  const fetchMutation = useMutation({
    mutationFn: ({ url }: FetchWorkflowArgs) =>
      chatApi
        .sendMessage(`Please fetch and summarize the content at this URL: ${url}`)
        .then((r) => r.data),

    onMutate: () => {
      setLoading(true);
      setError(null);
      setResult(null);
    },

    onSuccess: (data: ChatResponse) => {
      setLoading(false);
      setResult({
        promptName: 'fetch',
        response: data.response,
        toolCalls: data.tool_calls,
      });
    },

    onError: (error: unknown) => {
      setLoading(false);
      const message = parseApiError(error);
      toast.error(message);
      if (isServiceUnavailable(error)) {
        navigate('/service-error');
      }
      setError(message);
    },
  });

  return {
    execute: mutation.mutate,
    executeFetch: fetchMutation.mutate,
    isLoading: mutation.isPending || fetchMutation.isPending,
    error: mutation.error ?? fetchMutation.error,
  };
}
