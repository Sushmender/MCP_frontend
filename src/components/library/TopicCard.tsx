import { FolderOpen, ArrowRight } from 'lucide-react';
import { formatTopicName } from '@/utils/formatters';

interface TopicCardProps {
  topic: string;
  paperCount: number;
  onClick: () => void;
}

export function TopicCard({ topic, paperCount, onClick }: TopicCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between p-5 rounded-xl border border-border bg-card/65 backdrop-blur-sm hover:bg-accent/40 hover:border-primary/30 text-left transition-all duration-200 shadow-sm hover:translate-y-[-3px] hover:shadow-md"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground/95 group-hover:text-primary transition-colors truncate">
            {formatTopicName(topic)}
          </h4>
          <p className="text-xs text-muted-foreground/80 mt-0.5">
            {paperCount} {paperCount === 1 ? 'paper' : 'papers'} cached
          </p>
        </div>
      </div>
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200 shrink-0 shadow-sm">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}
