// src/app/login/page.tsx
"use client";

import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <SignupForm />
    </main>
  );
}
