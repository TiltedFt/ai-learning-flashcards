"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { LoginSchema } from "@/contracts/auth-schema";
import { ErrorMessage } from "@hookform/error-message";
import { TxtInput } from "./txt-input-field";

export function LoginForm() {
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
      console.log(data);
    },
    (errors) => {
      console.log(errors);
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
                    Don't have an account? <Link href="/signup">Sign up</Link>
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
