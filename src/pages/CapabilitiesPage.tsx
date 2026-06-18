import { Cpu } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export function CapabilitiesPage() {
  return (
    <div className="p-6 h-full flex items-center justify-center">
      <EmptyState
        icon={Cpu}
        title="System Capabilities"
        description="Explore all available MCP tools, named prompt templates, and resource URIs. Coming in Day 3."
      />
    </div>
  );
}
