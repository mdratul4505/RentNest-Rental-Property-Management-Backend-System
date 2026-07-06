import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { CategoryValidation } from "./category.validation";
import { Role } from "../../../generated/prisma";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  auth(Role.ADMIN),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  categoryController.createCategory
);

export const categoryRoutes = router;
