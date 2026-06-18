import { BookOpen } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';

export function LibraryPage() {
  return (
    <div className="p-6 h-full flex items-center justify-center">
      <EmptyState
        icon={BookOpen}
        title="Paper Library"
        description="Browse cached papers by topic. No LLM calls — reads directly from local paper storage. Coming in Day 3."
      />
    </div>
  );
}
