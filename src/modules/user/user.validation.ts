import { z } from "zod";
import { Role } from "../../../generated/prisma";

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }).min(1, "Name cannot be empty"),
    email: z.string({ message: "Email is required" }).email("Invalid email address"),
    password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
    role: z.enum([Role.TENANT, Role.LANDLORD], {
      message: "Role is required and must be either TENANT or LANDLORD",
    }),
  }),
});

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["active", "blocked", "ACTIVE", "BLOCKED"], {
      message: "Status is required and must be active or blocked",
    }),
  }),
});

export const UserValidation = {
  registerUserValidationSchema,
  updateUserStatusValidationSchema,
};
