// src/app/login/page.tsx
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <LoginForm />
    </main>
  );
}
