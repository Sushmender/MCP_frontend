import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { BackendStatusBanner } from '@/components/layout/BackendStatusBanner';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { ToastContainer } from '@/components/shared/ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useBackendHealth();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const backendOnline = useAppStore((s) => s.backendOnline);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Global Toasts */}
      <ToastContainer />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col flex-1 min-w-0 transition-all duration-300',
          sidebarOpen ? 'ml-0' : 'ml-0',
        )}
      >
        {/* Top header */}
        <Header />

        {/* Offline banner */}
        {!backendOnline && <BackendStatusBanner />}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
