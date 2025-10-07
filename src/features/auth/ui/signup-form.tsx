"use client";
import { Button } from "@/shared/ui/components/button";
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
import { SignupSchema } from "@/entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { TxtInput } from "@/shared/ui/txt-input-field";
import { notify } from "@/shared/lib/notifications";
import { useRouter } from "next/navigation";
import { useSignup } from "../api/use-signup";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useSignup();
  const form = useForm({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });
  const handleSignup = form.handleSubmit(
    async (data) => {
      const result = await signup(data);

      if (!result) {
        notify.error("Signup failed");
        return;
      }

      notify.success("Account created");
      router.replace("/books");
      router.refresh();
    },
    (errs: FieldErrors) => {
      Object.values(errs).forEach(
        (e) => e?.message && notify.error(String(e.message))
      );
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={handleSignup} noValidate>
            <FieldGroup className="gap-1">
              <Field>
                <TxtInput<{ firstName: string }>
                  name="firstName"
                  label="First name"
                  type="text"
                />
              </Field>
              <Field>
                <TxtInput<{ lastName: string }>
                  name="lastName"
                  label="Last name"
                  type="text"
                />
              </Field>
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
                  placeholder="Must be at least 8 characters long."
                />
              </Field>
              <FieldGroup>
                <Field>
                  <Button type="submit">Create Account</Button>
                  <FieldDescription className="px-6 text-center">
                    Already have an account? <Link href="/login">Sign in</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default SignupForm;
