import { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType } from '@/types/api.types';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';

interface ChatThreadProps {
  messages: ChatMessageType[];
}

export function ChatThread({ messages }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom smoothly on new messages or loading updates
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="flex-1 divide-y divide-border">
        {messages.map((message) => {
          if (message.isLoading) {
            return <LoadingMessage key={message.id} />;
          }
          return <ChatMessage key={message.id} message={message} />;
        })}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
