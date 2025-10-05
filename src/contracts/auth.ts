import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Enter valid email address."),
  password: z.string().min(1, "Password can not be empty."),
});

export const SignupSchema = z.object({
  email: z.email("Enter valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  firstName: z.string().min(1, "First name can not be empty."),
  lastName: z.string().min(1, "Last name can not be empty."),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
