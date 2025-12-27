import { ReactNode, useState, useCallback } from "react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import AnnouncementBanner from "./AnnouncementBanner";
import ScrollProgress from "./ScrollProgress";
import PageTransition from "./PageTransition";
import Preloader from "./Preloader";
import SmoothScrollProvider from "./SmoothScrollProvider";

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
  const [isLoading, setIsLoading] = useState(showPreloader);
  
  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <SmoothScrollProvider>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      <div className="min-h-screen bg-background flex flex-col">
        <ScrollProgress />
        {showBanner && <AnnouncementBanner />}
        <PublicNav />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <PublicFooter />
      </div>
    </SmoothScrollProvider>
  );
}
