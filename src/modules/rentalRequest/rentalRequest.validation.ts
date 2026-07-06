import { z } from "zod";
import { RentalStatus } from "../../../generated/prisma";

const createRentalRequestValidationSchema = z.object({
  body: z.object({
    propertyId: z.string({ message: "Property ID is required" }),
    moveInDate: z.string({ message: "Move-in date is required" }).refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format. Must be a valid date string.",
    }),
  }),
});

const updateRentalRequestStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([RentalStatus.APPROVED, RentalStatus.REJECTED], {
      message: "Status must be either APPROVED or REJECTED",
    }),
  }),
});

export const RentalRequestValidation = {
  createRentalRequestValidationSchema,
  updateRentalRequestStatusValidationSchema,
};
