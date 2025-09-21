"use client";

import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";

export function Providers({ children }: PropsWithChildren) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      {children}
      <Toaster richColors position="top-center" />
    </TooltipProvider>
  );
}
