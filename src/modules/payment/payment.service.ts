import Stripe from "stripe";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import config from "../../config/index.js";
import { AppError } from "../../errors/AppError";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma";

const stripe = new Stripe(config.stripe_secret_key || "", {
  apiVersion: "2025-01-27.accredited-gratis" as any, // standard api version or fallback
});

const createPaymentIntentInDB = async (rentalId: string, userId: string) => {
  if (!config.stripe_secret_key) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Stripe secret key is not configured");
  }

  const rental = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to pay for this rental request");
  }

  if (rental.status !== RentalStatus.APPROVED) {
    throw new AppError(httpStatus.BAD_REQUEST, "Rental request is not approved yet");
  }

  if (rental.payment) {
    if (rental.payment.status === PaymentStatus.COMPLETED) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment has already been completed for this rental request");
    }
    // Delete existing pending payment to avoid duplicates
    await prisma.payment.delete({
      where: { id: rental.payment.id },
    });
  }

  // Create Stripe PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: rental.property.price * 100, // in cents
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      rentalId: rental.id,
      userId: userId,
    },
  });

  // Create payment record in DB
  const payment = await prisma.payment.create({
    data: {
      transactionId: paymentIntent.id,
      amount: rental.property.price,
      method: "card",
      provider: "STRIPE",
      status: PaymentStatus.PENDING,
      rentalId: rental.id,
      userId: userId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: payment.transactionId,
    amount: payment.amount,
  };
};

const confirmPaymentInDB = async (transactionId: string, userId: string) => {
  if (!config.stripe_secret_key) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Stripe secret key is not configured");
  }

  const payment = await prisma.payment.findUnique({
    where: { transactionId },
    include: {
      rental: true,
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment record not found");
  }

  if (payment.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to confirm this payment");
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment; // Already completed
  }

  // Retrieve status from Stripe to verify actual payment success
  const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);
  if (paymentIntent.status !== "succeeded") {
    throw new AppError(httpStatus.BAD_REQUEST, `Payment has not succeeded on Stripe. Status: ${paymentIntent.status}`);
  }

  // Use transaction to update payment status, rental status, and property availability
  const result = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { transactionId },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    const updatedRental = await tx.rentalRequest.update({
      where: { id: payment.rentalId },
      data: {
        status: RentalStatus.ACTIVE,
      },
    });

    await tx.property.update({
      where: { id: updatedRental.propertyId },
      data: {
        isAvailable: false,
      },
    });

    return updatedPayment;
  });

  return result;
};

const getUserPaymentsFromDB = async (userId: string) => {
  return await prisma.payment.findMany({
    where: { userId },
    include: {
      rental: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentByIdFromDB = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rental: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (role !== "ADMIN" && payment.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntentInDB,
  confirmPaymentInDB,
  getUserPaymentsFromDB,
  getPaymentByIdFromDB,
};
