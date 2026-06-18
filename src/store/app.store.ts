import { create } from 'zustand';

interface AppState {
  backendOnline: boolean;
  sidebarOpen: boolean;
  setBackendOnline: (online: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  backendOnline: true, // optimistic default
  sidebarOpen: true,
  setBackendOnline: (online) => set({ backendOnline: online }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
