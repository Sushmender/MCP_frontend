import { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Code2 } from 'lucide-react';
import type { ToolCall } from '@/types/api.types';

interface ToolCallsAccordionProps {
  toolCalls: ToolCall[];
}

export function ToolCallsAccordion({ toolCalls }: ToolCallsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);

  if (!toolCalls || toolCalls.length === 0) return null;

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const toggleCall = (id: string) => {
    setExpandedCall((prev) => (prev === id ? null : id));
  };

  return (
    <div className="my-2 border border-border rounded-lg bg-card/65 backdrop-blur-sm overflow-hidden text-xs max-w-full">
      {/* Header bar */}
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/40 hover:bg-muted/80 transition-colors text-muted-foreground font-medium select-none"
      >
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-primary" />
          <span>
            Used {toolCalls.length} {toolCalls.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {isOpen ? 'hide details' : 'show details'}
          </span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      {/* Accordion content */}
      {isOpen && (
        <div className="border-t border-border divide-y divide-border animate-accordion-down">
          {toolCalls.map((call) => {
            const isCallExpanded = expandedCall === call.id;
            return (
              <div key={call.id} className="flex flex-col">
                <button
                  onClick={() => toggleCall(call.id)}
                  className="flex items-center justify-between px-3 py-2 hover:bg-accent/40 text-left transition-colors font-mono font-medium text-foreground/90"
                >
                  <span className="flex items-center gap-1">
                    <Code2 className="w-3 h-3 text-muted-foreground" />
                    {call.name}
                  </span>
                  {isCallExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>

                {isCallExpanded && (
                  <div className="px-3 pb-3 pt-1 bg-muted/20 border-t border-border/50 animate-accordion-down">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 tracking-wider">
                      Arguments
                    </p>
                    <pre className="p-2 rounded bg-muted/60 font-mono text-[11px] overflow-x-auto border border-border/50 max-h-48 whitespace-pre-wrap break-all">
                      {JSON.stringify(call.input, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
