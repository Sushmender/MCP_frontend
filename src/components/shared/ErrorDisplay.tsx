import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'inline' | 'card';
}

export function ErrorDisplay({
  message,
  onRetry,
  className,
  variant = 'card',
}: ErrorDisplayProps) {
  if (variant === 'inline') {
    return (
      <p className={cn('flex items-center gap-1.5 text-sm text-destructive', className)}>
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        {message}
      </p>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center',
        className,
      )}
    >
      <AlertCircle className="w-8 h-8 text-destructive" />
      <p className="text-sm text-destructive font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
}
