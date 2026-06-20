import { Info } from 'lucide-react';
import type { Tool } from '@/types/api.types';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const properties = Object.entries(tool.input_schema.properties || {});
  const requiredFields = tool.input_schema.required || [];

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/20 hover:shadow transition-all duration-200">
      {/* Tool header */}
      <div className="space-y-1.5">
        <h4 className="text-sm font-mono font-bold text-foreground">
          {tool.name}
        </h4>
        <p className="text-xs text-muted-foreground/90 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Inputs Parameter Table */}
      {properties.length > 0 ? (
        <div className="mt-2 space-y-2.5">
          <h5 className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
            Arguments Schema
          </h5>
          <div className="overflow-x-auto border border-border/80 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Presence</th>
                  <th className="px-3 py-2 font-medium hidden sm:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {properties.map(([name, prop]) => {
                  const isRequired = requiredFields.includes(name);
                  return (
                    <tr key={name} className="hover:bg-accent/15 transition-colors text-foreground/90">
                      <td className="px-3 py-2 font-mono font-semibold text-foreground">{name}</td>
                      <td className="px-3 py-2">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground">
                          {prop.type || 'string'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide border',
                            isRequired
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/15'
                              : 'bg-muted/50 text-muted-foreground border-border/50',
                          )}
                        >
                          {isRequired ? 'required' : 'optional'}
                        </span>
                      </td>
                      <td className="px-3 py-2 hidden sm:table-cell max-w-xs truncate" title={prop.description}>
                        {prop.description || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 py-1.5 text-xs text-muted-foreground font-medium select-none">
          <Info className="w-3.5 h-3.5" />
          <span>Requires no input parameters.</span>
        </div>
      )}
    </div>
  );
}
