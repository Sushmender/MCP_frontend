import { ServerCrash, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { healthApi } from '@/api/health.api';
import { useAppStore } from '@/store/app.store';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';

export function ServiceErrorPage() {
  const [checking, setChecking] = useState(false);
  const setBackendOnline = useAppStore((s) => s.setBackendOnline);
  const navigate = useNavigate();

  const retry = async () => {
    setChecking(true);
    try {
      const res = await healthApi.check();
      if (res.data.status === 'healthy') {
        setBackendOnline(true);
        navigate(ROUTES.CHAT);
      }
    } catch {
      setBackendOnline(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-12 text-center">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
        <ServerCrash className="w-10 h-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Service Unavailable</h1>
        <p className="text-muted-foreground max-w-md">
          The research backend is currently offline. Please make sure the FastAPI server is
          running at <code className="font-mono text-sm bg-muted px-1 rounded">http://127.0.0.1:8000</code>.
        </p>
      </div>
      <button
        onClick={retry}
        disabled={checking}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
        {checking ? 'Checking…' : 'Retry Connection'}
      </button>
    </div>
  );
}
