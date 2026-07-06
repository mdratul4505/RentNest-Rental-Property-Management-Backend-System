import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email address"),
    password: z.string({ message: "Password is required" }),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
};
