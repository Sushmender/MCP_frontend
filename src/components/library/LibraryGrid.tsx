import { ChevronLeft, Library, FolderOpen } from 'lucide-react';
import type { TopicMap, PaperMap } from '@/types/api.types';
import { TopicCard } from './TopicCard';
import { PaperCard } from './PaperCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatTopicName } from '@/utils/formatters';

interface LibraryGridProps {
  topics: TopicMap | null;
  papers: PaperMap | null;
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  isLoadingTopics: boolean;
  isLoadingPapers: boolean;
}

export function LibraryGrid({
  topics,
  papers,
  selectedTopic,
  onSelectTopic,
  isLoadingTopics,
  isLoadingPapers,
}: LibraryGridProps) {
  // ─── 1. Loading Skeletons ──────────────────────────────────────────────────

  const renderTopicsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-5 rounded-xl border border-border bg-card/40 animate-pulse h-[80px]"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
        </div>
      ))}
    </div>
  );

  const renderPapersSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card/40 animate-pulse"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-7 bg-muted rounded w-20 shrink-0" />
          </div>
          <div className="h-3 bg-muted rounded w-1/2 border-b border-border/40 pb-3" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );

  // ─── 2. Selected Topic Detail View ─────────────────────────────────────────

  if (selectedTopic) {
    return (
      <div className="space-y-6">
        {/* Navigation Breadcrumb bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTopic(null)}
            className="flex items-center justify-center p-1.5 rounded-lg border border-border bg-card hover:bg-accent hover:text-foreground text-muted-foreground transition-colors shrink-0 shadow-sm"
            aria-label="Back to topics list"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
              <span>Library</span>
              <span>/</span>
              <span className="truncate">{selectedTopic}</span>
            </div>
            <h3 className="text-base font-bold text-foreground truncate mt-0.5">
              {formatTopicName(selectedTopic)}
            </h3>
          </div>
        </div>

        {/* Papers list rendering */}
        {isLoadingPapers ? (
          renderPapersSkeleton()
        ) : !papers || Object.keys(papers).length === 0 ? (
          <div className="py-12 bg-muted/5 rounded-xl border border-dashed border-border flex items-center justify-center">
            <EmptyState
              icon={FolderOpen}
              title="Empty Folder"
              description="No metadata files found for this topic directory. Try executing queries about this topic in Chat to gather files."
            />
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(papers).map((paper) => (
              <PaperCard key={paper.pdf_url} paper={paper} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── 3. Grid of Topics View ────────────────────────────────────────────────

  if (isLoadingTopics) {
    return renderTopicsSkeleton();
  }

  if (!topics || Object.keys(topics).length === 0) {
    return (
      <div className="py-16 bg-muted/5 rounded-xl border border-dashed border-border flex items-center justify-center">
        <EmptyState
          icon={Library}
          title="Library is Empty"
          description="No papers have been searched or cached yet. Use the Chat interface to ask about papers, which will download them into your local library."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(topics).map(([topicName, paperIds]) => (
        <TopicCard
          key={topicName}
          topic={topicName}
          paperCount={paperIds.length}
          onClick={() => onSelectTopic(topicName)}
        />
      ))}
    </div>
  );
}
