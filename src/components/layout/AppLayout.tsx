import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { BackendStatusBanner } from '@/components/layout/BackendStatusBanner';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useBackendHealth } from '@/hooks/useBackendHealth';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Zap, BookOpen, Cpu } from 'lucide-react';
import { ROUTES } from '@/constants';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useBackendHealth();
  const backendOnline = useAppStore((s) => s.backendOnline);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Global Toasts */}
      <ToastContainer />

      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top header */}
        <Header />

        {/* Offline banner */}
        {!backendOnline && <BackendStatusBanner />}

        {/* Page content */}
        <main className="flex-1 overflow-auto pb-16 sm:pb-0">
          <div className="h-full animate-fade-in">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}

function MobileNav() {
  const navItems = [
    { label: 'Chat', path: ROUTES.CHAT, Icon: MessageSquare },
    { label: 'Workflows', path: ROUTES.WORKFLOWS, Icon: Zap },
    { label: 'Library', path: ROUTES.LIBRARY, Icon: BookOpen },
    { label: 'Capabilities', path: ROUTES.CAPABILITIES, Icon: Cpu },
  ];

  return (
    <nav className="sm:hidden flex items-center justify-around border-t border-border bg-card/85 backdrop-blur-md py-2 px-3 shrink-0">
      {navItems.map(({ label, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === ROUTES.CHAT}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors py-1 px-3.5 rounded-lg',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
