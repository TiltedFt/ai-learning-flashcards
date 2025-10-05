"use client";
import { Button } from "@/components/ui/button";
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
import { SignupSchema } from "@/contracts/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { TxtInput } from "./txt-input-field";

// SignupSchema
export function SignupForm() {
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
      console.log(data);
    },
    (errors) => {
      console.log(errors);
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
