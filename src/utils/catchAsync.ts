import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../errors/AppError";

export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);

      const statusCode =
        error instanceof AppError ? error.statusCode : httpStatus.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Something went wrong",
        errorDetails: error instanceof Error ? error.message : error,
      });
    }
  };
};