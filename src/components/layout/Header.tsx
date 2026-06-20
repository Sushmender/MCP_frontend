import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, Circle } from 'lucide-react';
import { useAppStore } from '@/store/app.store';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Chat', subtitle: 'Ask me anything about academic research' },
  '/workflows': { title: 'Research Workflows', subtitle: 'Guided AI research templates' },
  '/library': { title: 'Paper Library', subtitle: 'Browse your cached papers' },
  '/capabilities': { title: 'Capabilities', subtitle: 'Tools, prompts & resources' },
};

export function Header() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const backendOnline = useAppStore((s) => s.backendOnline);
  const { pathname } = useLocation();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const info = PAGE_TITLES[pathname] ?? { title: 'MCP Research', subtitle: '' };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm shrink-0">
      {/* Left — hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors hidden sm:block"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-foreground">{info.title}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">{info.subtitle}</p>
        </div>
      </div>

      {/* Right — backend status + dark mode */}
      <div className="flex items-center gap-3">
        {/* Backend status dot */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Circle
            className={cn(
              'w-2 h-2 fill-current',
              backendOnline ? 'text-emerald-500' : 'text-red-500',
            )}
          />
          <span className="hidden sm:inline">{backendOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
