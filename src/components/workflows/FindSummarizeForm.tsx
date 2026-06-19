import { useForm } from 'react-hook-form';
import { Search, Hash, Play } from 'lucide-react';
import { PROMPT_NAMES } from '@/constants';

interface FormData {
  topic: string;
  max_results: number;
}

interface FindSummarizeFormProps {
  onSubmit: (promptName: string, args: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function FindSummarizeForm({ onSubmit, isLoading }: FindSummarizeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { topic: '', max_results: 3 },
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit(PROMPT_NAMES.FIND_AND_SUMMARIZE, {
      topic: data.topic.trim(),
      max_results: Number(data.max_results),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Topic Search Input */}
      <div className="space-y-1.5">
        <label htmlFor="topic" className="text-xs font-semibold text-foreground/95 flex items-center gap-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          Research Topic
        </label>
        <input
          id="topic"
          type="text"
          placeholder="e.g. quantum error correction"
          disabled={isLoading}
          {...register('topic', { required: 'Topic is required' })}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all duration-200"
        />
        {errors.topic && (
          <p className="text-xs text-destructive font-medium mt-1 select-none animate-slide-in">
            {errors.topic.message}
          </p>
        )}
      </div>

      {/* Max Results Number Input */}
      <div className="space-y-1.5">
        <label htmlFor="max_results" className="text-xs font-semibold text-foreground/95 flex items-center gap-1">
          <Hash className="w-3.5 h-3.5 text-muted-foreground" />
          Max Results (1-10)
        </label>
        <input
          id="max_results"
          type="number"
          min={1}
          max={10}
          disabled={isLoading}
          {...register('max_results', {
            required: 'Max results is required',
            min: { value: 1, message: 'Minimum value is 1' },
            max: { value: 10, message: 'Maximum value is 10' },
          })}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all duration-200"
        />
        {errors.max_results && (
          <p className="text-xs text-destructive font-medium mt-1 select-none animate-slide-in">
            {errors.max_results.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/95 transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        {isLoading ? 'Searching arXiv…' : 'Find & Summarize'}
      </button>
    </form>
  );
}
