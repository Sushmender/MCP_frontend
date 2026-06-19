import { Bot, User, Folder, FileCode, ScrollText, PlayCircle } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/types/api.types';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { ToolCallsAccordion } from './ToolCallsAccordion';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Determine smart query visual indicator
  const getSmartBadge = () => {
    if (isUser || !message.resultType || message.resultType === 'chat') return null;

    const badges = {
      resources_list: {
        icon: Folder,
        label: 'Resources Directory',
        style: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      },
      resource: {
        icon: FileCode,
        label: 'Resource Read',
        style: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      },
      prompts_list: {
        icon: ScrollText,
        label: 'Prompts Catalog',
        style: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      },
      prompt_result: {
        icon: PlayCircle,
        label: 'Prompt Output',
        style: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      },
    };

    const badge = badges[message.resultType as keyof typeof badges];
    if (!badge) return null;

    const BadgeIcon = badge.icon;
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-medium tracking-wide mb-2',
          badge.style,
        )}
      >
        <BadgeIcon className="w-3 h-3" />
        <span>{badge.label}</span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex gap-4 p-4 border-b border-border transition-colors',
        isUser ? 'bg-muted/10' : 'bg-card/20',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border shadow-sm',
          isUser
            ? 'bg-primary/10 text-primary border-primary/20'
            : 'bg-secondary text-secondary-foreground border-border',
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground/90">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Smart query badge indicator */}
        {getSmartBadge()}

        {/* Message text body */}
        <div className="text-sm leading-relaxed break-words text-foreground/95">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Tool calls accordion */}
        {!isUser && message.toolCalls && message.toolCalls.length > 0 && (
          <ToolCallsAccordion toolCalls={message.toolCalls} />
        )}
      </div>
    </div>
  );
}
