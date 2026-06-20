import { useState } from 'react';
import { useTopicList, useTopicPapers } from '@/hooks/useLibrary';
import { LibraryGrid } from '@/components/library/LibraryGrid';

export function LibraryPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { data: topics, isLoading: isLoadingTopics } = useTopicList();
  const { data: papers, isLoading: isLoadingPapers } = useTopicPapers(selectedTopic);

  return (
    <div className="p-6 h-full flex flex-col gap-6 bg-background/30 backdrop-blur-md overflow-auto">
      {/* Header text info */}
      {!selectedTopic && (
        <div className="pb-3 border-b border-border shrink-0">
          <h2 className="text-lg font-bold text-foreground">Paper Library</h2>
          <p className="text-xs text-muted-foreground">
            Browse and study research documents currently cached in your local server storage.
          </p>
        </div>
      )}

      {/* Library Browse grid content */}
      <div className="flex-1 min-h-0">
        <LibraryGrid
          topics={topics || null}
          papers={papers || null}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          isLoadingTopics={isLoadingTopics}
          isLoadingPapers={isLoadingPapers}
        />
      </div>
    </div>
  );
}
