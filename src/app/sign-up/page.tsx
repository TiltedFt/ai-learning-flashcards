// src/app/login/page.tsx
"use client";
import { SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <SignupForm />
    </main>
  );
}
