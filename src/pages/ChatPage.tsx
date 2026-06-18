import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export function ChatPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Placeholder — full implementation in Day 2 */}
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={MessageSquare}
          title="Chat Interface"
          description="Ask me anything about academic research. I can search arXiv, summarize papers, compare studies, and browse the web."
        />
      </div>
    </div>
  );
}
