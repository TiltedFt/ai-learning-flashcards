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
} from "@/shared/ui/components/field";
import Link from "next/link";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { LoginSchema } from "@/entities/user";
import { TxtInput } from "@/shared/ui/txt-input-field";
import { notify } from "@/shared/lib/notifications";
import { useLogin } from "../api/use-login";

export function LoginForm() {
  const { login } = useLogin();
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
      const result = await login(data);

      if (!result) {
        // Error already handled by hook
        notify.error("Login failed");
        return;
      }

      notify.success("Welcome " + result.user.firstName);
      window.location.href = "/books";
    },
    (errs: FieldErrors) => {
      Object.values(errs).forEach(
        (e) => e?.message && notify.error(String(e.message))
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
                    Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
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
