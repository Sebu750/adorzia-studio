import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "next-themes";
// Public Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Studio Pages (Protected)
import Dashboard from "./pages/Dashboard";
import Walkthroughs from "./pages/Walkthroughs";
import WalkthroughDetail from "./pages/WalkthroughDetail";
import Styleboxes from "./pages/Styleboxes";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import Jobs from "./pages/Jobs";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDesigners from "./pages/admin/AdminDesigners";
import AdminPublications from "./pages/admin/AdminPublications";
import AdminProductionQueues from "./pages/admin/AdminProductionQueues";
import AdminStyleboxes from "./pages/admin/AdminStyleboxes";
import AdminWalkthroughs from "./pages/admin/AdminWalkthroughs";
import AdminRankings from "./pages/admin/AdminRankings";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              } />
              
            {/* Protected Studio App Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/walkthroughs" element={
              <ProtectedRoute>
                <Walkthroughs />
              </ProtectedRoute>
            } />
            <Route path="/walkthroughs/:id" element={
              <ProtectedRoute>
                <WalkthroughDetail />
              </ProtectedRoute>
            } />
            <Route path="/styleboxes" element={
              <ProtectedRoute>
                <Styleboxes />
              </ProtectedRoute>
            } />
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Portal Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/designers" element={
              <ProtectedRoute requireAdmin>
                <AdminDesigners />
              </ProtectedRoute>
            } />
            <Route path="/admin/styleboxes" element={
              <ProtectedRoute requireAdmin>
                <AdminStyleboxes />
              </ProtectedRoute>
            } />
            <Route path="/admin/walkthroughs" element={
              <ProtectedRoute requireAdmin>
                <AdminWalkthroughs />
              </ProtectedRoute>
            } />
            <Route path="/admin/rankings" element={
              <ProtectedRoute requireAdmin>
                <AdminRankings />
              </ProtectedRoute>
            } />
            <Route path="/admin/publications" element={
              <ProtectedRoute requireAdmin>
                <AdminPublications />
              </ProtectedRoute>
            } />
            <Route path="/admin/queues" element={
              <ProtectedRoute requireAdmin>
                <AdminProductionQueues />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin>
                <AdminSettings />
              </ProtectedRoute>
            } />
            
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
