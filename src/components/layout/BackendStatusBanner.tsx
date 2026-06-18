import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/app.store';
import { healthApi } from '@/api/health.api';
import { useState } from 'react';

export function BackendStatusBanner() {
  const setBackendOnline = useAppStore((s) => s.setBackendOnline);
  const [checking, setChecking] = useState(false);

  const retry = async () => {
    setChecking(true);
    try {
      const res = await healthApi.check();
      setBackendOnline(res.data.status === 'healthy');
    } catch {
      setBackendOnline(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 text-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>
          Backend is offline. Make sure the FastAPI server is running at{' '}
          <code className="font-mono text-xs">http://127.0.0.1:8000</code>.
        </span>
      </div>
      <button
        onClick={retry}
        disabled={checking}
        className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs font-medium disabled:opacity-50"
      >
        <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
        {checking ? 'Checking…' : 'Retry'}
      </button>
    </div>
  );
}
