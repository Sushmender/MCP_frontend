import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Zap,
  BookOpen,
  Cpu,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app.store';
import { ROUTES } from '@/constants';

const NAV_ITEMS = [
  { label: 'Chat', path: ROUTES.CHAT, Icon: MessageSquare, desc: 'AI research queries' },
  { label: 'Workflows', path: ROUTES.WORKFLOWS, Icon: Zap, desc: 'Guided templates' },
  { label: 'Library', path: ROUTES.LIBRARY, Icon: BookOpen, desc: 'Cached papers' },
  { label: 'Capabilities', path: ROUTES.CAPABILITIES, Icon: Cpu, desc: 'Tools & prompts' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        'relative flex flex-col bg-card border-r border-border transition-all duration-300 shrink-0',
        sidebarOpen ? 'w-60' : 'w-16',
      )}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
          <FlaskConical className="w-4 h-4 text-primary" />
        </div>
        {sidebarOpen && (
          <div className="min-w-0 animate-fade-in">
            <p className="font-semibold text-sm text-foreground truncate">MCP Research</p>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map(({ label, path, Icon, desc }) => (
          <NavLink
            key={path}
            to={path}
            end={path === ROUTES.CHAT}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground',
              )
            }
            title={!sidebarOpen ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                {sidebarOpen && (
                  <div className="min-w-0 animate-fade-in">
                    <p className="truncate">{label}</p>
                    <p className="text-xs text-muted-foreground truncate">{desc}</p>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-border">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full h-9 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
