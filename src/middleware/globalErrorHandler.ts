import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: any = err;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorDetails = {
      issues: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = null;
  } else if (err?.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database client request error";
    errorDetails = {
      code: err.code,
      meta: err.meta,
      message: err.message,
    };
  } else if (err?.name === "PrismaClientValidationError") {
    statusCode = 400;
    message = "Database validation error";
    errorDetails = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
    errorDetails = process.env.NODE_ENV === "development" ? err.stack : null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};
