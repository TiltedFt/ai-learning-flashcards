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
  FieldLabel,
} from "@/shared/ui/components/field";
import { Input } from "@/shared/ui/components/input";
import { SignupSchema } from "@/entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import { TxtInput } from "@/shared/ui/txt-input-field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// SignupSchema
export function SignupForm() {
  const router = useRouter();
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
      try {
        const r = await fetch("/api/sign-up", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const j = await r.json();
        console.log(r.status);
        if (r.status !== 201) {
          if (j.details) toast.error(j.details);
          else if (j.error) toast.error(j.error);
          else toast.error("Signup failed");
          return;
        }
        toast.success("Account created");
        router.replace("/books");
        router.refresh();
      } catch {
        toast.error("Network error");
      }
    },
    (errs: FieldErrors) => {
      Object.values(errs).forEach(
        (e) => e?.message && toast.error(String(e.message))
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
