import { useForm } from 'react-hook-form';
import { Link, Download } from 'lucide-react';

interface FormData {
  url: string;
}

interface FetchUrlFormProps {
  onSubmit: (promptName: string, args: Record<string, unknown>) => void;
  isLoading: boolean;
}

export function FetchUrlForm({ onSubmit, isLoading }: FetchUrlFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { url: '' },
  });

  const handleFormSubmit = (data: FormData) => {
    // 'fetch_url' maps to the MCP tool registered in research_server.py.
    // The backend will make a real HTTP GET, strip HTML, and let the LLM
    // read and summarize the page content.
    onSubmit('fetch_url', { url: data.url.trim() });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground/90">Fetch URL</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Enter any URL — the backend will fetch the real page content and the AI
          will read and analyze it for you.
        </p>
      </div>

      {/* URL input */}
      <div className="space-y-1.5">
        <label
          htmlFor="fetch-url"
          className="text-xs font-semibold text-foreground/95 flex items-center gap-1"
        >
          <Link className="w-3.5 h-3.5 text-muted-foreground" />
          URL
        </label>
        <input
          id="fetch-url"
          type="url"
          placeholder="https://github.com/Sushmender/MCP_1"
          disabled={isLoading}
          {...register('url', {
            required: 'URL is required',
            pattern: {
              value: /^https?:\/\/.+/,
              message: 'Must be a valid URL starting with http:// or https://',
            },
          })}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background/50 text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 transition-all duration-200"
        />
        {errors.url && (
          <p className="text-xs text-destructive font-medium mt-1 select-none animate-slide-in">
            {errors.url.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="fetch-url-submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/95 transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isLoading ? 'Fetching…' : 'Fetch'}
      </button>
    </form>
  );
}
