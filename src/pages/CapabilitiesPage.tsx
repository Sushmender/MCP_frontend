import { useState } from 'react';
import { useTools, usePrompts, useResources } from '@/hooks/useCapabilities';
import { ToolCard } from '@/components/capabilities/ToolCard';
import { PromptCard } from '@/components/capabilities/PromptCard';
import { ResourceCard } from '@/components/capabilities/ResourceCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Cpu, ScrollText, Link2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'tools' | 'prompts' | 'resources';

export function CapabilitiesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('tools');

  // Parallel fetches
  const { data: tools, isLoading: isLoadingTools } = useTools();
  const { data: prompts, isLoading: isLoadingPrompts } = usePrompts();
  const { data: resourcesData, isLoading: isLoadingResources } = useResources();

  // Combine resources and templates
  const allResources = [
    ...(resourcesData?.resources || []),
    ...(resourcesData?.resource_templates || []),
  ];

  const tabs = [
    { id: 'tools' as TabId, label: 'Tools', count: tools?.length ?? 0, icon: Cpu, desc: 'Executable functions' },
    { id: 'prompts' as TabId, label: 'Prompts', count: prompts?.length ?? 0, icon: ScrollText, desc: 'Research templates' },
    { id: 'resources' as TabId, label: 'Resources', count: allResources.length, icon: Link2, desc: 'Server files & URI templates' },
  ];

  // ─── Loading Skeletons ──────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card/40 animate-pulse h-[180px]"
        >
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
          <div className="flex-1 bg-muted/40 border border-border/40 rounded-lg" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col gap-6 bg-background/30 backdrop-blur-md overflow-auto">
      {/* Header title */}
      <div className="pb-3 border-b border-border shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">System Capabilities</h2>
          <p className="text-xs text-muted-foreground">
            Explore the tools, named templates, and file schemas exposed by connected MCP servers.
          </p>
        </div>

        {/* Small info tip */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-card/40 text-[10px] sm:text-xs text-muted-foreground select-none max-w-xs">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>These capabilities are dynamically registered by MCP servers.</span>
        </div>
      </div>

      {/* Tabs selector */}
      <div className="grid grid-cols-3 gap-2 p-1 rounded-xl border border-border bg-card/40 shrink-0">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2.5 rounded-lg px-4 py-2.5 text-center sm:text-left transition-all duration-200 border border-transparent',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary/20 shadow-sm'
                  : 'hover:bg-accent hover:text-foreground text-muted-foreground',
              )}
            >
              <TabIcon className="w-4 h-4 shrink-0" />
              <div className="min-w-0 flex items-center gap-1.5">
                <span className="font-semibold text-xs sm:text-sm truncate">{tab.label}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded-full text-[9px] font-bold border leading-none',
                    isActive
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-muted border-border text-muted-foreground',
                  )}
                >
                  {tab.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="flex-1 min-h-0">
        {/* Tools Section */}
        {activeTab === 'tools' && (
          isLoadingTools ? (
            renderSkeleton()
          ) : !tools || tools.length === 0 ? (
            <div className="py-16 bg-muted/5 rounded-xl border border-dashed border-border flex items-center justify-center">
              <EmptyState icon={Cpu} title="No Registered Tools" description="There are no tools registered by the MCP backend." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          )
        )}

        {/* Prompts Section */}
        {activeTab === 'prompts' && (
          isLoadingPrompts ? (
            renderSkeleton()
          ) : !prompts || prompts.length === 0 ? (
            <div className="py-16 bg-muted/5 rounded-xl border border-dashed border-border flex items-center justify-center">
              <EmptyState icon={ScrollText} title="No Prompt Templates" description="No prompt templates have been registered by the MCP server catalog." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((prompt) => (
                <PromptCard key={prompt.name} prompt={prompt} />
              ))}
            </div>
          )
        )}

        {/* Resources Section */}
        {activeTab === 'resources' && (
          isLoadingResources ? (
            renderSkeleton()
          ) : allResources.length === 0 ? (
            <div className="py-16 bg-muted/5 rounded-xl border border-dashed border-border flex items-center justify-center">
              <EmptyState icon={Link2} title="No Available Resources" description="No file paths or template schemas have been registered by the server." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allResources.map((res) => (
                <ResourceCard
                  key={'uri_template' in res ? res.uri_template : res.uri}
                  resource={res}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
