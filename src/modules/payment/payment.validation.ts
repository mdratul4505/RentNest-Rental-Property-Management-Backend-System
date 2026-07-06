import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    rentalId: z.string({ message: "Rental ID is required" }),
  }),
});

const confirmPaymentValidationSchema = z.object({
  body: z.object({
    transactionId: z.string({ message: "Transaction ID is required" }),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
  confirmPaymentValidationSchema,
};
