import { useForm } from 'react-hook-form';
import { FileText, Play, AlertTriangle } from 'lucide-react';
import { PROMPT_NAMES } from '@/constants';

interface FormData {
  paper_id1: string;
  paper_id2: string;
}

interface ComparePapersFormProps {
  onSubmit: (promptName: string, args: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function ComparePapersForm({ onSubmit, isLoading }: ComparePapersFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { paper_id1: '', paper_id2: '' },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit(PROMPT_NAMES.COMPARE, {
      paper_id_1: data.paper_id1.trim(),
      paper_id_2: data.paper_id2.trim(),
    });
  };

  const idValidationRules = {
    required: 'Paper ID is required',
    pattern: {
      value: /^[0-9a-zA-Z./_-]+$/,
      message: 'Invalid Paper ID format',
    },
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Warning Tip Box */}
      <div className="flex gap-2.5 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs leading-normal">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Warning:</strong> Comparing two papers requires fetching both from arXiv and running deep cross-analysis. This workflow can take <strong>1–3 minutes</strong>. If you encounter timeouts, try searching for each paper individually in Chat first to cache them.
        </p>
      </div>

      {/* Paper 1 ID */}
      <div className="space-y-1.5">
        <label htmlFor="paper_id1" className="text-xs font-semibold text-foreground/95 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          First Paper ID
        </label>
        <input
          id="paper_id1"
          type="text"
          placeholder="e.g. 1706.03762"
          disabled={isLoading}
          {...register('paper_id1', idValidationRules)}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all duration-200"
        />
        {errors.paper_id1 && (
          <p className="text-xs text-destructive font-medium mt-1 select-none animate-slide-in">
            {errors.paper_id1.message}
          </p>
        )}
      </div>

      {/* Paper 2 ID */}
      <div className="space-y-1.5">
        <label htmlFor="paper_id2" className="text-xs font-semibold text-foreground/95 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          Second Paper ID
        </label>
        <input
          id="paper_id2"
          type="text"
          placeholder="e.g. 2010.11929"
          disabled={isLoading}
          {...register('paper_id2', idValidationRules)}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all duration-200"
        />
        {errors.paper_id2 && (
          <p className="text-xs text-destructive font-medium mt-1 select-none animate-slide-in">
            {errors.paper_id2.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/95 transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        {isLoading ? 'Running Comparison…' : 'Compare Papers'}
      </button>
    </form>
  );
}
