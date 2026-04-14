import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import Auth from "@/pages/Auth";
import CountrySelect from "@/pages/CountrySelect";
import Dashboard from "@/pages/Dashboard";
import LearningHub from "@/pages/LearningHub";
import AIMentor from "@/pages/AIMentor";
import SmartEditor from "@/pages/SmartEditor";
import DevArena from "@/pages/DevArena";
import NotFound from "@/pages/NotFound";
import MockInterviewPage from "./pages/MockInterviewPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!profile?.country) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? (profile?.country ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />) : <Auth />}
      />
      <Route
        path="/onboarding"
        element={user ? (profile?.country ? <Navigate to="/dashboard" replace /> : <CountrySelect />) : <Navigate to="/auth" replace />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout userName={profile?.full_name || undefined} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="learning-hub" element={<LearningHub />} />
        <Route path="ai-mentor" element={<AIMentor />} />
        <Route path="smart-editor" element={<SmartEditor />} />
        <Route path="dev-arena" element={<DevArena />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
