import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ScrollToTop from "@/components/public/ScrollToTop";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import StyleBoxesInfo from "./pages/public/StyleBoxesInfo";
import MarketplacePreview from "./pages/public/MarketplacePreview";
import Competitions from "./pages/public/Competitions";
import StudioInfo from "./pages/public/StudioInfo";
import Monetization from "./pages/public/Monetization";
import Pricing from "./pages/public/Pricing";
import ForBrands from "./pages/public/ForBrands";
import Support from "./pages/public/Support";
import Studios from "./pages/Studios";
import DesignerProfiles from "./pages/public/DesignerProfiles";

// Auth Pages
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Studio Pages (Protected)
import Dashboard from "./pages/Dashboard";
import Walkthroughs from "./pages/Walkthroughs";
import WalkthroughDetail from "./pages/WalkthroughDetail";
import Styleboxes from "./pages/Styleboxes";
import StyleboxPreview from "./pages/StyleboxPreview";
import Portfolio from "./pages/Portfolio";
import Collections from "./pages/Collections";
import Jobs from "./pages/Jobs";
import Teams from "./pages/Teams";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
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
import AdminCollections from "./pages/admin/AdminCollections";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <SubscriptionProvider>
              <Routes>
                {/* Public Website Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/styleboxes-info" element={<StyleBoxesInfo />} />
                <Route path="/marketplace-preview" element={<MarketplacePreview />} />
                <Route path="/competitions" element={<Competitions />} />
                <Route path="/studio-info" element={<StudioInfo />} />
                <Route path="/monetization" element={<Monetization />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/brands" element={<ForBrands />} />
                <Route path="/support" element={<Support />} />
                <Route path="/designers" element={<DesignerProfiles />} />
                <Route path="/studios" element={<Studios />} />
                
                {/* Auth Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected Studio App Routes */}
                <Route path="/subscription" element={
                  <ProtectedRoute>
                    <Subscription />
                  </ProtectedRoute>
                } />
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
                <Route path="/styleboxes/:id" element={
                  <ProtectedRoute>
                    <StyleboxPreview />
                  </ProtectedRoute>
                } />
                <Route path="/portfolio" element={
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                } />
                <Route path="/collections" element={
                  <ProtectedRoute>
                    <Collections />
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
                <Route path="/admin/collections" element={
                  <ProtectedRoute requireAdmin>
                    <AdminCollections />
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
