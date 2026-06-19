import { BookOpen, Scale, FileSearch, RefreshCw } from 'lucide-react';
import { useWorkflowStore } from '@/store/workflow.store';
import { useWorkflow } from '@/hooks/useWorkflow';
import { SummarizePaperForm } from '@/components/workflows/SummarizePaperForm';
import { ComparePapersForm } from '@/components/workflows/ComparePapersForm';
import { FindSummarizeForm } from '@/components/workflows/FindSummarizeForm';
import { WorkflowResult } from '@/components/workflows/WorkflowResult';
import type { WorkflowType } from '@/types/api.types';
import { cn } from '@/lib/utils';

export function WorkflowsPage() {
  const { activeTab, currentResult, isLoading, error, setActiveTab } = useWorkflowStore();
  const { execute } = useWorkflow();

  const handleExecute = (promptName: string, args: Record<string, unknown>) => {
    execute({ promptName, args });
  };

  const handleRetry = () => {
    if (!currentResult && !error) return;
    // We can't re-trigger without the form inputs, so we let the user clear and re-fill
    useWorkflowStore.getState().reset();
  };

  const tabs = [
    { id: 'summarize' as WorkflowType, label: 'Summarize Paper', icon: BookOpen, desc: 'Analyze a single study' },
    { id: 'compare' as WorkflowType, label: 'Compare Papers', icon: Scale, desc: 'Cross-analyze two studies' },
    { id: 'find_and_summarize' as WorkflowType, label: 'Find & Summarize', icon: FileSearch, desc: 'Search arXiv by topic' },
  ];

  return (
    <div className="p-6 h-full flex flex-col gap-6 bg-background/30 backdrop-blur-md overflow-auto">
      {/* Page header controls */}
      <div className="flex justify-between items-center pb-3 border-b border-border shrink-0">
        <div>
          <h2 className="text-lg font-bold text-foreground">Guided Research Workflows</h2>
          <p className="text-xs text-muted-foreground">Select a workflow template to execute structured LLM pipelines</p>
        </div>
        {(currentResult || error) && (
          <button
            onClick={() => useWorkflowStore.getState().reset()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-semibold text-foreground/80 hover:text-foreground transition-all duration-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Form
          </button>
        )}
      </div>

      {/* Grid container: Split pane layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0">
        {/* Left Side: Tabs + Forms (span 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Custom Tabs List */}
          <div className="flex flex-col gap-1.5 p-1.5 rounded-xl border border-border bg-card/65 backdrop-blur-sm">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-start gap-3 rounded-lg px-3.5 py-3 text-left transition-all duration-250 border border-transparent disabled:opacity-50',
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary/20 shadow-sm'
                      : 'hover:bg-accent hover:text-foreground text-muted-foreground',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                      isActive ? 'bg-white/10 text-white' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <TabIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{tab.label}</p>
                    <p
                      className={cn(
                        'text-xs truncate leading-normal',
                        isActive ? 'text-primary-foreground/85' : 'text-muted-foreground/80',
                      )}
                    >
                      {tab.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Form Box */}
          <div className="p-6 rounded-xl border border-border bg-card/65 backdrop-blur-sm shadow-sm">
            {activeTab === 'summarize' && (
              <SummarizePaperForm onSubmit={handleExecute} isLoading={isLoading} />
            )}
            {activeTab === 'compare' && (
              <ComparePapersForm onSubmit={handleExecute} isLoading={isLoading} />
            )}
            {activeTab === 'find_and_summarize' && (
              <FindSummarizeForm onSubmit={handleExecute} isLoading={isLoading} />
            )}
          </div>
        </div>

        {/* Right Side: Results Pane (span 7) */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-[350px]">
          <WorkflowResult
            result={currentResult}
            isLoading={isLoading}
            error={error}
            activeTab={activeTab}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
}
