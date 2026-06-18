import { create } from 'zustand';
import type { WorkflowResult, WorkflowType } from '@/types/api.types';

interface WorkflowState {
  activeTab: WorkflowType;
  currentResult: WorkflowResult | null;
  isLoading: boolean;
  error: string | null;
  setActiveTab: (tab: WorkflowType) => void;
  setResult: (result: WorkflowResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  activeTab: 'summarize',
  currentResult: null,
  isLoading: false,
  error: null,
  setActiveTab: (tab) => set({ activeTab: tab, currentResult: null, error: null }),
  setResult: (result) => set({ currentResult: result }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ currentResult: null, error: null, isLoading: false }),
}));
