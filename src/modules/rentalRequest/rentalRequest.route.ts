import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { RentalRequestValidation } from "./rentalRequest.validation";
import { Role } from "../../../generated/prisma";

const rentalsRouter = Router();
rentalsRouter.post(
  "/",
  auth(Role.TENANT),
  validateRequest(RentalRequestValidation.createRentalRequestValidationSchema),
  rentalRequestController.createRentalRequest
);
rentalsRouter.get(
  "/",
  auth(Role.TENANT, Role.LANDLORD),
  rentalRequestController.getMyRentalRequests
);
rentalsRouter.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  rentalRequestController.getRentalRequestById
);

const landlordRentalsRouter = Router();
landlordRentalsRouter.get(
  "/",
  auth(Role.LANDLORD),
  rentalRequestController.getLandlordRequests
);
landlordRentalsRouter.patch(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(RentalRequestValidation.updateRentalRequestStatusValidationSchema),
  rentalRequestController.updateRentalRequestStatus
);

const adminRentalsRouter = Router();
adminRentalsRouter.get(
  "/",
  auth(Role.ADMIN),
  rentalRequestController.getAllRentalsForAdmin
);

export const rentalRoutes = rentalsRouter;
export const landlordRentalRoutes = landlordRentalsRouter;
export const adminRentalRoutes = adminRentalsRouter;
