import { ReactNode } from "react";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { MarketplaceFooter } from "./MarketplaceFooter";

interface MarketplaceLayoutProps {
  children: ReactNode;
}

export function MarketplaceLayout({ children }: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketplaceHeader />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter />
    </div>
  );
}
