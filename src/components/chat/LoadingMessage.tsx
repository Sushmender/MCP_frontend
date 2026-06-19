import { Bot } from 'lucide-react';
import { ElapsedTimer } from '@/components/shared/ElapsedTimer';
import { LOADING_MESSAGES } from '@/constants';

export function LoadingMessage() {
  return (
    <div className="flex gap-4 p-4 border-b border-border bg-card/20 animate-pulse">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border border-border bg-secondary text-secondary-foreground shadow-sm">
        <Bot className="w-4 h-4" />
      </div>

      {/* Message content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground/90">AI Assistant</span>
          <span className="text-[10px] text-muted-foreground">Thinking…</span>
        </div>

        {/* Loading details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {/* Pulsing loading dots */}
            <div className="flex items-center gap-1 h-4">
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </div>
            <span className="text-sm text-muted-foreground/90 font-medium">
              {LOADING_MESSAGES.chat}
            </span>
          </div>

          <div className="text-[11px] text-muted-foreground bg-muted/30 border border-border/40 inline-flex self-start px-2 py-0.5 rounded font-mono select-none">
            <ElapsedTimer running={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
