import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import { Role } from "../../../generated/prisma";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidation.registerUserValidationSchema),
  userController.registerUser
);
router.get("/me", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), userController.getMe); 

export const userRoutes = router;