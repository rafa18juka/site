import { PropsWithChildren } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";

export function SiteShell({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen flex-col bg-brand-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}