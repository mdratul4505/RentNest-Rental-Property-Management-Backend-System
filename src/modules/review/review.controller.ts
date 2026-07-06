import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await reviewService.createReviewIntoDB(req.body, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};
