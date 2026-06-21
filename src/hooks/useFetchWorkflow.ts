import { useMutation } from '@tanstack/react-query';
import { chatApi } from '@/api/chat.api';
import { useWorkflowStore } from '@/store/workflow.store';
import { parseApiError, isServiceUnavailable } from '@/utils/errorParser';
import type { ChatResponse } from '@/types/api.types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/store/toast.store';

/**
 * Manages the Fetch workflow tab.
 *
 * Sends a guided chat message that instructs the LLM to call the `fetch_url`
 * MCP tool with the supplied URL, then stream the page content back as a
 * summary.  Results are stored in the shared WorkflowStore so WorkflowResult
 * can render them in the right pane.
 */
export function useFetchWorkflow() {
  const { setResult, setLoading, setError } = useWorkflowStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ url }: { url: string }) => {
      const message =
        `Please use the fetch tool to retrieve the content of this URL: ${url}\n\n` +
        `After fetching, provide:\n` +
        `1. A brief description of what the page is about\n` +
        `2. Key information, topics, or content found on the page\n` +
        `3. Any important links, data, or takeaways`;
      return chatApi.sendMessage(message).then((r) => r.data);
    },

    onMutate: () => {
      setLoading(true);
      setError(null);
      setResult(null);
    },

    onSuccess: (data: ChatResponse) => {
      setLoading(false);
      setResult({
        promptName: 'fetch_url',
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
    isLoading: mutation.isPending,
  };
}
