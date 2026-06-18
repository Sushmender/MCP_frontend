import { create } from 'zustand';
import type { ChatMessage } from '@/types/api.types';

interface ChatState {
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  chatError: string | null;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (updates: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chatHistory: [],
  isChatLoading: false,
  chatError: null,

  addMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),

  updateLastMessage: (updates) =>
    set((state) => {
      const history = [...state.chatHistory];
      if (history.length === 0) return state;
      history[history.length - 1] = { ...history[history.length - 1], ...updates };
      return { chatHistory: history };
    }),

  setLoading: (loading) => set({ isChatLoading: loading }),
  setError: (error) => set({ chatError: error }),
  clearHistory: () => set({ chatHistory: [], chatError: null }),
}));
