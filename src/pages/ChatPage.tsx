import { MessageSquare, Trash2, Search, Folder, Terminal } from 'lucide-react';
import { useChatStore } from '@/store/chat.store';
import { useChat } from '@/hooks/useChat';
import { ChatThread } from '@/components/chat/ChatThread';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/shared/EmptyState';

const SUGGESTIONS = [
  {
    icon: Search,
    title: 'Find Papers',
    desc: 'Search arXiv for specific research topics',
    query: 'find papers on transformer attention mechanisms',
  },
  {
    icon: Folder,
    title: 'Explore Folders',
    desc: 'Browse all cached papers resource folders',
    query: '@folders',
  },
  {
    icon: Terminal,
    title: 'List Prompts',
    desc: 'See all registered named prompt templates',
    query: '/prompts',
  },
];

export function ChatPage() {
  const { chatHistory, isChatLoading, clearHistory } = useChatStore();
  const { sendMessage } = useChat();

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const hasMessages = chatHistory.length > 0;

  return (
    <div className="flex flex-col h-full bg-background/30 backdrop-blur-md">
      {/* Top Toolbar */}
      {hasMessages && (
        <div className="flex justify-between items-center px-6 py-2.5 bg-card/40 border-b border-border text-xs">
          <span className="text-muted-foreground font-medium">
            Active session ({chatHistory.length} messages)
          </span>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-medium transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </button>
        </div>
      )}

      {/* Main chat body */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {hasMessages ? (
          <ChatThread messages={chatHistory} />
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-y-auto">
            <div className="max-w-xl w-full flex flex-col items-center">
              <EmptyState
                icon={MessageSquare}
                title="Academic Research Assistant"
                description="Ask me anything about academic research. You can query arXiv, read resource folders, or trigger research templates."
                className="p-6 mb-6"
              />

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                {SUGGESTIONS.map((s) => {
                  const SugIcon = s.icon;
                  return (
                    <button
                      key={s.query}
                      onClick={() => handleSend(s.query)}
                      className="group flex flex-col text-left p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/40 hover:border-primary/30 transition-all duration-200 shadow-sm hover:translate-y-[-2px] hover:shadow"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0 mb-3">
                        <SugIcon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground/95 mb-1 group-hover:text-primary transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-xs text-muted-foreground/90 leading-normal">
                        {s.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message input */}
      <ChatInput onSend={handleSend} disabled={isChatLoading} />
    </div>
  );
}
