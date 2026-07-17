import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config/index.js";
import { AppError } from "../errors/AppError";
import { Role } from "../../generated/prisma";
import { jwtUtils } from "../utils/jwt";


export type TDecodedUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
};

export const auth = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret as string
      ) as TDecodedUser;

      req.user = decoded;

      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "You do not have permission");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};