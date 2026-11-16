import { useState } from "react"; // Fixed: Added missing useState import
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AppLayout } from "@/components/AppLayout";
import Auth from "@/pages/Auth";
import CountrySelect from "@/pages/CountrySelect";
import Dashboard from "@/pages/Dashboard";
import LearningHub from "@/pages/LearningHub";
import AIMentor from "@/pages/AIMentor";
import SmartEditor from "@/pages/SmartEditor";
import DevArena from "@/pages/DevArena";
import NewsPage from "./pages/NewsPage";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import MockInterviewPage from "./pages/MockInterviewPage";
import InterviewRoomPage from "./pages/InterviewRoomPage";
import 'regenerator-runtime/runtime';
import ResultPage from "./pages/ResultPage";
import CheatSheets from "./pages/CheatSheets";
import PracticeLab from "./pages/PracticeLab";
import Preloader from "@/components/Preloader";

const queryClient = new QueryClient();

// --- Protected Route Logic ---
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

// --- Route Definitions ---
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
      
      {/* Dashboard & Main App Layout */}
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
        <Route path="/tech-news" element={<NewsPage />} />
        <Route path="/mock-interview" element={<MockInterviewPage />} />
        <Route path="/interview-room" element={<InterviewRoomPage />} />
        <Route path="/result" element={<ResultPage/>} />
        <Route path="/cheatsheets" element={<CheatSheets/>} />
        <Route path="/practice-lab" element={<PracticeLab/>} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// --- Main App Component ---
const App = () => {
  const [preloaderDone, setPreloaderDone] = useState(
    () => !!sessionStorage.getItem("gtx_loaded")
  );

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("gtx_loaded", "1");
    setPreloaderDone(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <AppRoutes />
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// CRITICAL FIX: Export default add kiya
export default App;