// src/app/sign-up/page.tsx
import { SignupForm } from "@/features/auth";

export default function SignupPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <SignupForm />
    </main>
  );
}
