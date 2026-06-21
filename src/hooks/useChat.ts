import { useMutation } from '@tanstack/react-query';
import { useChatStore } from '@/store/chat.store';
import { handleQueryInput } from '@/utils/queryRouter';
import { parseApiError, isServiceUnavailable } from '@/utils/errorParser';
import { generateId } from '@/utils/formatters';
import type { ChatMessage, ChatResponse, QueryResult } from '@/types/api.types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/store/toast.store';

/**
 * Manages sending a chat message (or any smart-routed query).
 * Appends messages optimistically, then updates with the real response.
 */
export function useChat() {
  const { addMessage, updateLastMessage, setLoading, setError } = useChatStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (input: string) => handleQueryInput(input),

    onMutate: (input) => {
      // Add user message immediately
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: input,
        timestamp: Date.now(),
      };
      addMessage(userMsg);

      // Add loading placeholder for assistant
      const loadingMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isLoading: true,
      };
      addMessage(loadingMsg);
      setLoading(true);
      setError(null);
    },

    onSuccess: (result: QueryResult) => {
      setLoading(false);
      const content = formatQueryResult(result);
      updateLastMessage({
        content,
        isLoading: false,
        toolCalls: extractToolCalls(result),
        resultType: result.type,
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
      updateLastMessage({
        content: `⚠️ ${message}`,
        isLoading: false,
      });
    },
  });

  return {
    sendMessage: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatQueryResult(result: QueryResult): string {
  switch (result.type) {
    case 'chat':
    case 'prompt_result':
      return (result.data as ChatResponse).response;
    case 'prompts_list': {
      const data = result.data as { prompts: Array<{ name: string; description: string }> };
      return (
        '**Available Prompts:**\n\n' +
        data.prompts
          .map((p) => `- **${p.name}** — ${p.description}`)
          .join('\n')
      );
    }
    case 'resources_list': {
      const data = result.data as {
        resources: Array<{ uri: string; name: string }>;
        resource_templates: Array<{ uri_template: string; name: string }>;
      };
      const lines = [
        '**Available Resources:**\n',
        ...data.resources.map((r) => `- \`${r.uri}\` — ${r.name}`),
        '\n**Resource Templates:**\n',
        ...data.resource_templates.map((t) => `- \`${t.uri_template}\` — ${t.name}`),
      ];
      return lines.join('\n');
    }
    case 'folders_list': {
      // data.content is a JSON string: { topic: [paper_id, …], … }
      const data = result.data as { content: string };
      try {
        const topicMap = JSON.parse(data.content) as Record<string, string[]>;
        const topics = Object.entries(topicMap);
        if (topics.length === 0) {
          return (
            '**No folders found yet.**\n\n' +
            'Run a search first — e.g. type `find papers on RAG` in the chat.\n' +
            'Once papers are saved, use `@folders` to browse them.'
          );
        }
        const lines = [
          `**Stored Topic Folders** (${topics.length} found)\n`,
          '| Topic | Papers | Command |',
          '|---|---|---|',
          ...topics.map(
            ([topic, ids]) =>
              `| ${topic.replace(/_/g, ' ')} | ${ids.length} | \`@${topic}\` |`,
          ),
          '',
          '_Tip: type_ `@<topic>` _to read all papers for that folder._',
        ];
        return lines.join('\n');
      } catch {
        return data.content;
      }
    }
    case 'resource': {
      const data = result.data as { content: string };
      try {
        const parsed = JSON.parse(data.content);
        return '```json\n' + JSON.stringify(parsed, null, 2) + '\n```';
      } catch {
        return data.content;
      }
    }
    default:
      return JSON.stringify(result.data, null, 2);
  }
}

function extractToolCalls(result: QueryResult) {
  if (result.type === 'chat' || result.type === 'prompt_result') {
    return (result.data as ChatResponse).tool_calls;
  }
  return [];
}
