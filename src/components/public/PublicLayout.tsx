import { ReactNode, useState, useEffect } from "react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import AnnouncementBanner from "./AnnouncementBanner";
import ScrollProgress from "./ScrollProgress";
import PageTransition from "./PageTransition";
import Preloader from "./Preloader";
import SmoothScrollProvider from "./SmoothScrollProvider";
import { useAuth } from "@/hooks/useAuth";

interface PublicLayoutProps {
  children: ReactNode;
  showBanner?: boolean;
  showPreloader?: boolean;
}

export default function PublicLayout({ 
  children, 
  showBanner = false,
  showPreloader = false 
}: PublicLayoutProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(showPreloader);

  return (
    <SmoothScrollProvider>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <div className="min-h-screen bg-background flex flex-col">
        <ScrollProgress />
        {/* Show announcement banner only for logged-out users */}
        {showBanner && !user && <AnnouncementBanner />}
        <PublicNav />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <PublicFooter />
      </div>
    </SmoothScrollProvider>
  );
}
