import { PropsWithChildren } from "react";
import { SiteShell } from "@/components/layout/site-shell";

export default function MarketingLayout({ children }: PropsWithChildren) {
  return <SiteShell>{children}</SiteShell>;
}