import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatPage } from '@/pages/ChatPage';
import { WorkflowsPage } from '@/pages/WorkflowsPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { CapabilitiesPage } from '@/pages/CapabilitiesPage';
import { ServiceErrorPage } from '@/pages/ServiceErrorPage';
import { ROUTES } from '@/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main app routes — wrapped in AppLayout */}
          <Route
            path="/*"
            element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<ChatPage />} />
                  <Route path="/workflows" element={<WorkflowsPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/capabilities" element={<CapabilitiesPage />} />
                  <Route path="/service-error" element={<ServiceErrorPage />} />
                  {/* Redirect unknown routes to chat */}
                  <Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
                </Routes>
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
