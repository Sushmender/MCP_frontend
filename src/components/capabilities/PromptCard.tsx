import { ArrowRight, CornerDownRight } from 'lucide-react';
import type { Prompt, WorkflowType } from '@/types/api.types';
import { useWorkflowStore } from '@/store/workflow.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES, PROMPT_NAMES } from '@/constants';
import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  const navigate = useNavigate();
  const setActiveTab = useWorkflowStore((s) => s.setActiveTab);

  const handleUsePrompt = () => {
    // Map Prompt template names to Workflow tabs
    let targetTab: WorkflowType = 'summarize';

    if (prompt.name === PROMPT_NAMES.COMPARE) {
      targetTab = 'compare';
    } else if (prompt.name === PROMPT_NAMES.FIND_AND_SUMMARIZE) {
      targetTab = 'find_and_summarize';
    }

    setActiveTab(targetTab);
    navigate(ROUTES.WORKFLOWS);
  };

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/20 hover:shadow transition-all duration-200">
      {/* Title / Description */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="text-sm font-mono font-bold text-foreground truncate">
            {prompt.name}
          </h4>
          <p className="text-xs text-muted-foreground/90 leading-relaxed">
            {prompt.description}
          </p>
        </div>
        <button
          onClick={handleUsePrompt}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <span>Use Workflow</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>

      {/* Arguments Checklist */}
      {prompt.arguments && prompt.arguments.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
            Required Arguments
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {prompt.arguments.map((arg) => (
              <div
                key={arg.name}
                className="flex items-start gap-2 p-2 rounded-lg border border-border/80 bg-muted/20 text-xs"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-semibold text-foreground">{arg.name}</span>
                    <span
                      className={cn(
                        'text-[9px] font-semibold px-1 rounded border leading-none py-0.5',
                        arg.required
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/15'
                          : 'bg-muted text-muted-foreground border-border',
                      )}
                    >
                      {arg.required ? 'required' : 'optional'}
                    </span>
                  </div>
                  {arg.description && (
                    <p className="text-[11px] text-muted-foreground mt-1 truncate" title={arg.description}>
                      {arg.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
