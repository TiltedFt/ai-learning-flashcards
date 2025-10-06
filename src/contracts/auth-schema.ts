import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Enter valid email address.").trim(),
  password: z.string().min(1, "Password can not be empty.").trim(),
});

export const SignupSchema = z.object({
  email: z.email("Enter valid email address.").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .trim(),
  firstName: z.string().min(1, "First name can not be empty.").trim(),
  lastName: z.string().min(1, "Last name can not be empty.").trim(),
});

const UsersResponseDataSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
});
export const SuccessfullAuthorizationSchema = z.object({
  user: UsersResponseDataSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginAndSignupResponse = z.infer<
  typeof SuccessfullAuthorizationSchema
>;
