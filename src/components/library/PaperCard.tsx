import { useState } from 'react';
import { Calendar, User, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { Paper } from '@/types/api.types';
import { formatDate, formatAuthors } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/20 hover:shadow transition-all duration-200">
      {/* Top Section: Title & PDF Button */}
      <div className="flex justify-between items-start gap-4">
        <h4 className="text-sm font-bold text-foreground leading-snug flex-1">
          {paper.title}
        </h4>
        <button
          onClick={() => window.open(paper.pdf_url, '_blank')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-semibold text-foreground/80 hover:text-foreground shrink-0 shadow-sm transition-colors"
          title="Open official arXiv PDF page in a new tab"
        >
          <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>View PDF</span>
          <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground/95 select-none border-b border-border/50 pb-3">
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          <span>{formatAuthors(paper.authors, 3)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Published: {formatDate(paper.published)}</span>
        </div>
      </div>

      {/* Abstract Content */}
      <div className="relative">
        <p
          onClick={toggleExpand}
          className={cn(
            'text-xs text-foreground/85 leading-relaxed break-words cursor-pointer transition-all duration-300',
            expanded ? 'whitespace-pre-wrap' : 'line-clamp-3',
          )}
        >
          {paper.summary}
        </p>

        {/* Expand/Collapse Toggle Button */}
        <button
          onClick={toggleExpand}
          className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-primary/90 hover:text-primary uppercase tracking-wider select-none"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>Show Less</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>Show Full Abstract</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
