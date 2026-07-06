import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { AppError } from "../errors/AppError";
import { Role } from "../../generated/prisma/enums";

export const auth = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

      req.user = decoded; // { userId, role }

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};