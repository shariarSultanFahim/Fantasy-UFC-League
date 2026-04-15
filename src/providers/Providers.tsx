"use client";

import type { ReactNode } from "react";

import { TooltipProvider } from "@/components/ui";
import { CounterProvider, QueryProvider } from "@/providers";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <CounterProvider>
        <QueryProvider>{children}</QueryProvider>
      </CounterProvider>
    </TooltipProvider>
  );
}
