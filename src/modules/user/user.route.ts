import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);
router.get("/me", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), userController.getMe); 


export const userRoutes = router