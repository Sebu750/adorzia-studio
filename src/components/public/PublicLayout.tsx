import { ReactNode } from "react";
import PublicNav from "./PublicNav";
import PublicFooter from "./PublicFooter";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
