"use client";

import { Toaster } from "sonner";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

// toaster for whole app
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster />
    </ErrorBoundary>
  );
}
