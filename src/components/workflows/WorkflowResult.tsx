import { Zap, HelpCircle } from 'lucide-react';
import type { WorkflowResult as WorkflowResultType, WorkflowType } from '@/types/api.types';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { ToolCallsAccordion } from '@/components/chat/ToolCallsAccordion';
import { ElapsedTimer } from '@/components/shared/ElapsedTimer';
import { ErrorDisplay } from '@/components/shared/ErrorDisplay';
import { EmptyState } from '@/components/shared/EmptyState';
import { LOADING_MESSAGES } from '@/constants';

interface WorkflowResultProps {
  result: WorkflowResultType | null;
  isLoading: boolean;
  error: string | null;
  activeTab: WorkflowType;
  onRetry?: () => void;
}

export function WorkflowResult({
  result,
  isLoading,
  error,
  activeTab,
  onRetry,
}: WorkflowResultProps) {
  // 1. Loading State
  if (isLoading) {
    const loadingText = LOADING_MESSAGES[activeTab] || 'Running workflow…';
    return (
      <div className="h-full flex flex-col justify-center items-center p-8 bg-card/20 rounded-xl border border-border/80 animate-pulse">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-1.5 h-6">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
          <p className="text-sm font-medium text-foreground/80">{loadingText}</p>
          <div className="px-3 py-1 bg-muted/40 rounded-lg text-xs font-mono border border-border/50 text-muted-foreground">
            <ElapsedTimer running={true} />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    const isTimeout = error.includes('timed out') || error.includes('300s');
    return (
      <div className="space-y-4">
        <ErrorDisplay message={error} onRetry={onRetry} variant="card" />

        {isTimeout && (
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-600 dark:text-amber-400 leading-relaxed space-y-1.5">
            <h5 className="font-semibold flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              Timeout Tip
            </h5>
            <p>
              Workflow prompt queries can time out if papers aren't cached locally yet.
              <strong> Try doing this:</strong> Search for the relevant paper title or ID directly in the <strong>Chat Page</strong> first. The AI assistant will automatically fetch, analyze, and save it on disk. Once cached, run this workflow again.
            </p>
          </div>
        )}
      </div>
    );
  }

  // 3. Success State
  if (result) {
    return (
      <div className="space-y-6">
        {/* Tool Call list if tools were run */}
        {result.toolCalls && result.toolCalls.length > 0 && (
          <div>
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1.5">
              Workflow Executed Tools
            </h4>
            <ToolCallsAccordion toolCalls={result.toolCalls} />
          </div>
        )}

        {/* Content body */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm prose prose-sm dark:prose-invert max-w-none">
          <h3 className="text-sm font-semibold text-muted-foreground border-b border-border pb-2 mb-4 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Zap className="w-3.5 h-3.5 text-primary" />
            Result Output
          </h3>
          <MarkdownRenderer content={result.response} />
        </div>
      </div>
    );
  }

  // 4. Default Empty State
  return (
    <div className="h-full flex items-center justify-center p-8 bg-muted/5 rounded-xl border border-dashed border-border/80">
      <EmptyState
        icon={Zap}
        title="No Result Generated"
        description="Select a template on the left, fill out the parameters, and click run to execute a research workflow."
        className="p-4"
      />
    </div>
  );
}
