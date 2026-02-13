import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { AdminThemeProvider } from "@/hooks/useAdminTheme";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { StudioThemeProvider } from "@/hooks/useStudioTheme";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
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
import Blog from "./pages/public/Blog";

// Marketplace Pages
import ShopHome from "./pages/shop/ShopHome";
import ShopProducts from "./pages/shop/ShopProducts";
import ShopProductDetail from "./pages/shop/ShopProductDetail";
import ShopCart from "./pages/shop/ShopCart";
import ShopDesigners from "./pages/shop/ShopDesigners";
import ShopDesignerProfile from "./pages/shop/ShopDesignerProfile";
import ShopCollections from "./pages/shop/ShopCollections";
import ShopOrderTracking from "./pages/shop/ShopOrderTracking";
import { CartProvider } from "@/hooks/useCart";

// Auth Pages
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";

// Studio Pages (Protected - Designer Role Required)
import Dashboard from "./pages/Dashboard";
import Walkthroughs from "./pages/Walkthroughs";
import WalkthroughDetail from "./pages/WalkthroughDetail";
import Styleboxes from "./pages/Styleboxes";
import StyleboxWorkspace from "./pages/StyleboxWorkspace";
import Portfolio from "./pages/Portfolio";
import Jobs from "./pages/Jobs";
import Teams from "./pages/Teams";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import FoundingDesignersProgram from "./pages/FoundingDesignersProgram";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDesigners from "./pages/admin/AdminDesigners";
import AdminPublications from "./pages/admin/AdminPublications";
import AdminProductionQueues from "./pages/admin/AdminProductionQueues";
import AdminStyleboxes from "./pages/admin/AdminStyleboxes";
import AdminStyleboxSubmissions from "./pages/admin/AdminStyleboxSubmissions";
import AdminWalkthroughs from "./pages/admin/AdminWalkthroughs";
import AdminRankings from "./pages/admin/AdminRankings";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminFoundingSubmissions from "./pages/admin/AdminFoundingSubmissions";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminFoundingReview from "./pages/admin/AdminFoundingReview";
import Articles from "./pages/public/Articles";
import ArticleDetail from "./pages/public/ArticleDetail";
import ShopCategory from "./pages/shop/ShopCategory";
const queryClient = new QueryClient();

// Wrapper component for Studio routes with Auth + Subscription + Theme providers
function StudioProviders() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <StudioThemeProvider>
          <Outlet />
        </StudioThemeProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

// Wrapper component for Admin routes with Admin Auth + Theme providers
function AdminProviders() {
  return (
    <AdminAuthProvider>
      <AdminThemeProvider>
        <Outlet />
      </AdminThemeProvider>
    </AdminAuthProvider>
  );
}

// Wrapper component for Public Website routes with fixed theme
function WebsiteWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" storageKey="website-theme" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* ============================================ */}
          {/* PUBLIC WEBSITE ROUTES - No Auth Required */}
          {/* ============================================ */}
          <Route element={<WebsiteWrapper><Outlet /></WebsiteWrapper>}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="styleboxes-info" element={<StyleBoxesInfo />} />
            <Route path="blog" element={<Blog />} />
            <Route path="competitions" element={<Competitions />} />
            <Route path="studio-info" element={<StudioInfo />} />
            <Route path="monetization" element={<Monetization />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="brands" element={<ForBrands />} />
            <Route path="support" element={<Support />} />
            <Route path="designers" element={<DesignerProfiles />} />
            <Route path="studios" element={<Studios />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/:slug" element={<ArticleDetail />} />
            
            {/* ============================================ */}
            {/* MARKETPLACE ROUTES - Public Shopping */}
            {/* ============================================ */}
            <Route path="shop" element={<CartProvider><ShopHome /></CartProvider>} />
            <Route path="shop/products" element={<CartProvider><ShopProducts /></CartProvider>} />
            <Route path="shop/designers" element={<CartProvider><ShopDesigners /></CartProvider>} />
            <Route path="shop/designer/:id" element={<CartProvider><ShopDesignerProfile /></CartProvider>} />
            <Route path="shop/collections" element={<CartProvider><ShopCollections /></CartProvider>} />
            <Route path="shop/product/:id" element={<CartProvider><ShopProductDetail /></CartProvider>} />
            <Route path="shop/category/:slug" element={<CartProvider><ShopCategory /></CartProvider>} />
            <Route path="shop/cart" element={<CartProvider><ShopCart /></CartProvider>} />
            <Route path="shop/order/:orderNumber" element={<CartProvider><ShopOrderTracking /></CartProvider>} />
            <Route path="shop/new-arrivals" element={<CartProvider><ShopProducts /></CartProvider>} />
          </Route>
          
          {/* ============================================ */}
          {/* AUTH ROUTES - Public Access (wrapped in Studio providers for redirect logic) */}
          {/* ============================================ */}
          <Route element={<ThemeProvider attribute="class" defaultTheme="light" enableSystem><Outlet /></ThemeProvider>}>
            <Route element={<StudioProviders />}>
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* ============================================ */}
              {/* STUDIO ROUTES - Authentication Required */}
              {/* ============================================ */}
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
                  <StyleboxWorkspace />
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } />
              <Route path="/founding-designers" element={
                <ProtectedRoute>
                  <FoundingDesignersProgram />
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
            </Route>
            
            {/* ============================================ */}
            {/* ADMIN ROUTES - Separate Auth Provider */}
            {/* ============================================ */}
            <Route element={<AdminProviders />}>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/designers" element={
                <AdminProtectedRoute>
                  <AdminDesigners />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/styleboxes" element={
                <AdminProtectedRoute>
                  <AdminStyleboxes />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/stylebox-submissions" element={
                <AdminProtectedRoute>
                  <AdminStyleboxSubmissions />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/walkthroughs" element={
                <AdminProtectedRoute>
                  <AdminWalkthroughs />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/rankings" element={
                <AdminProtectedRoute>
                  <AdminRankings />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/publications" element={
                <AdminProtectedRoute>
                  <AdminPublications />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/queues" element={
                <AdminProtectedRoute>
                  <AdminProductionQueues />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminProtectedRoute requireSuperadmin>
                  <AdminSettings />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <AdminProtectedRoute>
                  <AdminJobs />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/marketplace" element={
                <AdminProtectedRoute>
                  <AdminMarketplace />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/payouts" element={
                <AdminProtectedRoute>
                  <AdminPayouts />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/teams" element={
                <AdminProtectedRoute>
                  <AdminTeams />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <AdminProtectedRoute>
                  <AdminNotifications />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <AdminProtectedRoute>
                  <AdminAnalytics />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/security" element={
                <AdminProtectedRoute requireSuperadmin>
                  <AdminSecurity />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/articles" element={
                <AdminProtectedRoute>
                  <AdminArticles />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/collections" element={
                <AdminProtectedRoute>
                  <AdminCollections />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/founding-submissions" element={
                <AdminProtectedRoute>
                  <AdminFoundingSubmissions />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/founding-submissions/:id" element={
                <AdminProtectedRoute>
                  <AdminFoundingReview />
                </AdminProtectedRoute>
              } />
            </Route>
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
