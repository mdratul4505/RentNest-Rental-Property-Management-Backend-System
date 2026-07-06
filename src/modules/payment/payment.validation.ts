import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalId: z.string({ required_error: "Rental ID is required" }),
  }),
});

const confirmPaymentValidationSchema = z.object({
  body: z.object({
    transactionId: z.string({ required_error: "Transaction ID is required" }),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
  confirmPaymentValidationSchema,
};
