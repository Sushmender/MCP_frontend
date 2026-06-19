import { useForm } from 'react-hook-form';
import { FileText, Play } from 'lucide-react';
import { PROMPT_NAMES } from '@/constants';

interface FormData {
  paper_id: string;
}

interface SummarizePaperFormProps {
  onSubmit: (promptName: string, args: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function SummarizePaperForm({ onSubmit, isLoading }: SummarizePaperFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { paper_id: '' },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit(PROMPT_NAMES.SUMMARIZE, { paper_id: data.paper_id.trim() });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="paper_id" className="text-xs font-semibold text-foreground/95 flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
          Paper ID (arXiv)
        </label>
        <input
          id="paper_id"
          type="text"
          placeholder="e.g. 1706.03762"
          disabled={isLoading}
          {...register('paper_id', {
            required: 'Paper ID is required',
            pattern: {
              value: /^[0-9a-zA-Z./_-]+$/,
              message: 'Invalid Paper ID format',
            },
          })}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all duration-200"
        />
        {errors.paper_id && (
          <p className="text-xs text-destructive font-medium mt-1 select-none animate-slide-in">
            {errors.paper_id.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/95 transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        {isLoading ? 'Running Workflow…' : 'Summarize Paper'}
      </button>
    </form>
  );
}
