import { Router } from "express";
import { userController } from "../user/user.controller";
import { propertyController } from "../property/property.controller";
import { rentalRequestController } from "../rentalRequest/rentalRequest.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "../user/user.validation";
import { Role } from "../../../generated/prisma";

const router = Router();

// All routes here are restricted to ADMIN
router.use(auth(Role.ADMIN));

// User Management
router.get("/users", userController.getAllUsers);
router.patch(
  "/users/:id",
  validateRequest(UserValidation.updateUserStatusValidationSchema),
  userController.updateUserStatus
);

// Property listings management
router.get("/properties", propertyController.getAllPropertiesForAdmin);

// Rental requests management
router.get("/rentals", rentalRequestController.getAllRentalsForAdmin);

export const adminRoutes = router;
