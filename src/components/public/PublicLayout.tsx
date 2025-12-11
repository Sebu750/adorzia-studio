import { ReactNode } from "react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";
import AnnouncementBanner from "./AnnouncementBanner";
import { useAuth } from "@/hooks/useAuth";

interface PublicLayoutProps {
  children: ReactNode;
  showBanner?: boolean;
}

export default function PublicLayout({ children, showBanner = true }: PublicLayoutProps) {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Show announcement banner only for logged-out users */}
      {showBanner && !user && <AnnouncementBanner />}
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
