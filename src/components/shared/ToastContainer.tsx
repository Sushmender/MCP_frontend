import { useToastStore, Toast } from '@/store/toast.store';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const Icon = {
    success: CheckCircle,
    error: AlertTriangle,
    info: Info,
  }[toast.type];

  const colors = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
  }[toast.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border text-sm backdrop-blur-md shadow-lg pointer-events-auto',
        'animate-slide-in transition-all duration-300',
        colors,
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-xs sm:text-sm font-medium pr-2 break-words">
        {toast.message}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
