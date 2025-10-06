"use client";
import { Button } from "@/shared/ui/components/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/components/field";
import { Input } from "@/shared/ui/components/input";
import Link from "next/link";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import {
  LoginSchema,
  SuccessfullAuthorizationSchema,
} from "@/entities/user";
import { ErrorMessage } from "@hookform/error-message";
import { TxtInput } from "@/shared/ui/txt-input-field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const handleLogin = form.handleSubmit(
    async (data) => {
      try {
        const r = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j = await r.json();

        if (r.status !== 200) {
          if (j.details) toast.error(j.details);
          else if (j.error) toast.error(j.error);
          else toast.error("Login failed");
          return;
        }

        const parsed = SuccessfullAuthorizationSchema.safeParse(j);
        if (!parsed.success) {
          toast.error("Something went wrong. Contact support team.");
        }

        toast.success("Welcome " + parsed.data?.user.firstName);
        router.replace("/books");
        router.refresh(); 
      } catch {
        toast.error("Network error");
      }
    },
    (errs) => {
      Object.values(errs).forEach(
        (e: any) => e?.message && toast.error(e.message)
      );
    }
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={handleLogin} noValidate>
              <FieldGroup className="gap-3">
                <Field>
                  <TxtInput<{ email: string }>
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="me@example.com"
                  />
                </Field>
                <Field>
                  <TxtInput<{ password: string }>
                    name="password"
                    label="Password"
                    type="password"
                  />
                </Field>
                <Field>
                  <Button type="submit">Login</Button>
                  <FieldDescription className="text-center">
                    Don't have an account? <Link href="/sign-up">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
