import { Link, Layers } from 'lucide-react';
import type { ResourceInfo, ResourceTemplate } from '@/types/api.types';

interface ResourceCardProps {
  resource: ResourceInfo | ResourceTemplate;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const isTemplate = 'uri_template' in resource;
  const resolvedUri = isTemplate ? resource.uri_template : resource.uri;

  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/20 hover:shadow transition-all duration-200 text-xs">
      {/* Name and Mime badge */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground/95 leading-snug">
            {resource.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 select-none">
            <span
              className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                isTemplate
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/15'
              }`}
            >
              {isTemplate ? 'Template Schema' : 'Static Resource'}
            </span>
            {resource.mime_type && (
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/50">
                {resource.mime_type}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-muted-foreground/90 leading-relaxed">
          {resource.description}
        </p>
      )}

      {/* Resource Path URI */}
      <div className="mt-1 flex items-center gap-2 p-2 rounded-lg border border-border/80 bg-muted/40 font-mono text-[11px] overflow-x-auto text-foreground/95 select-all max-w-full">
        {isTemplate ? <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <Link className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        <code className="whitespace-nowrap">{resolvedUri}</code>
      </div>
    </div>
  );
}
