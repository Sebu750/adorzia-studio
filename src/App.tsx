import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Studio Pages
import Index from "./pages/Index";
import Styleboxes from "./pages/Styleboxes";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import Jobs from "./pages/Jobs";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDesigners from "./pages/admin/AdminDesigners";
import AdminPublications from "./pages/admin/AdminPublications";
import AdminStyleboxes from "./pages/admin/AdminStyleboxes";
import AdminRankings from "./pages/admin/AdminRankings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Studio App Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/styleboxes" element={<Styleboxes />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/designers" element={<AdminDesigners />} />
          <Route path="/admin/styleboxes" element={<AdminStyleboxes />} />
          <Route path="/admin/rankings" element={<AdminRankings />} />
          <Route path="/admin/publications" element={<AdminPublications />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
