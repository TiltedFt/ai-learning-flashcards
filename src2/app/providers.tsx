"use client";

import { Toaster } from "sonner";

// toaster for whole app
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
