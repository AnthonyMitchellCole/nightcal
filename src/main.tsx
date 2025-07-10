import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Configure React Query client for optimal caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes - cache kept in memory for 30 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Prevent refetch on window focus for better UX
      refetchOnReconnect: true, // Refetch when internet connection is restored
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
