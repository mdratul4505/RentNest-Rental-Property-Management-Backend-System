import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { ReviewValidation } from "./review.validation";
import { Role } from "../../../generated/prisma";

const router = Router();

router.post(
  "/",
  auth(Role.TENANT),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  reviewController.createReview
);

export const reviewRoutes = router;
