import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { PropertyValidation } from "./property.validation";
import { Role } from "../../../generated/prisma";

const publicRouter = Router();
publicRouter.get("/", propertyController.getAllProperties);
publicRouter.get("/:id", propertyController.getPropertyById);

const landlordRouter = Router();
landlordRouter.post(
  "/",
  auth(Role.LANDLORD),
  validateRequest(PropertyValidation.createPropertyValidationSchema),
  propertyController.createProperty
);
landlordRouter.put(
  "/:id",
  auth(Role.LANDLORD),
  validateRequest(PropertyValidation.updatePropertyValidationSchema),
  propertyController.updateProperty
);
landlordRouter.delete(
  "/:id",
  auth(Role.LANDLORD),
  propertyController.deleteProperty
);

const adminRouter = Router();
adminRouter.get("/", auth(Role.ADMIN), propertyController.getAllPropertiesForAdmin);

export const propertyRoutes = publicRouter;
export const landlordPropertyRoutes = landlordRouter;
export const adminPropertyRoutes = adminRouter;
