import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { navItems, rootRoute } from "./nav-items";
import Login from "./pages/Login";
import { LoaderIcon } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry 4xx errors
        if (error && 'status' in error && typeof error.status === 'number' && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
});

function ProtectedRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">HB</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Horizon Bank</h1>
              <p className="text-blue-600 font-medium">HR Management System</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-3 p-8">
            <LoaderIcon className="w-12 h-12 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600 animate-pulse">Loading your workspace...</p>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Securing your connection...</p>
            <p>Verifying permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={rootRoute.page} />
        {navItems.map(({ to, page }) => (
          <Route key={to} path={to} element={page} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-gray-50">
                <ProtectedRoutes />
              </div>
              <Toaster />
              <Sonner 
                position="top-right"
                expand={false}
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    color: '#374151',
                  },
                }}
              />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
