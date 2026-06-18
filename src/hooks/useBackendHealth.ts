import { useEffect } from 'react';
import { healthApi } from '@/api/health.api';
import { useAppStore } from '@/store/app.store';

/**
 * Checks backend health on mount. Sets backendOnline in appStore.
 * Polls every 30 seconds while offline.
 */
export function useBackendHealth() {
  const setBackendOnline = useAppStore((s) => s.setBackendOnline);
  const backendOnline = useAppStore((s) => s.backendOnline);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await healthApi.check();
        setBackendOnline(res.data.status === 'healthy');
      } catch {
        setBackendOnline(false);
      }
    };

    check();

    // Re-check every 30s when offline; stop polling when online
    const interval = setInterval(() => {
      if (!backendOnline) check();
    }, 30_000);

    return () => clearInterval(interval);
  }, [backendOnline, setBackendOnline]);

  return { backendOnline };
}
