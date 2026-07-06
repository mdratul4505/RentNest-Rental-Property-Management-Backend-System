import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { PaymentValidation } from "./payment.validation";
import { Role } from "../../../generated/prisma";

const router = Router();

router.post(
  "/create",
  auth(Role.TENANT),
  validateRequest(PaymentValidation.createPaymentValidationSchema),
  paymentController.createPaymentIntent
);

router.post(
  "/confirm",
  auth(Role.TENANT),
  validateRequest(PaymentValidation.confirmPaymentValidationSchema),
  paymentController.confirmPayment
);

router.get(
  "/",
  auth(Role.TENANT, Role.ADMIN),
  paymentController.getMyPayments
);

router.get(
  "/:id",
  auth(Role.TENANT, Role.ADMIN),
  paymentController.getPaymentById
);

export const paymentRoutes = router;
