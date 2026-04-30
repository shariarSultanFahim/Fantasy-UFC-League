import { z } from "zod";

export const signUpFormSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters."),
    username: z.string().trim().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().trim().min(10, "Phone number must be at least 10 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Za-z]/, "Password must include at least one letter.")
      .regex(/[0-9]/, "Password must include at least one number."),
    confirmPassword: z.string().min(8, "Confirm password is required."),
    acceptTerms: z.boolean().refine((value) => value, {
      message: "You must accept the terms to continue."
    })
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match."
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
