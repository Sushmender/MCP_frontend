import { Zap } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export function WorkflowsPage() {
  return (
    <div className="p-6 h-full flex items-center justify-center">
      <EmptyState
        icon={Zap}
        title="Research Workflows"
        description="Guided forms for summarizing papers, comparing two papers, and searching by topic. Coming in Day 2."
      />
    </div>
  );
}
