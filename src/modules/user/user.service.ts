import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { Role } from "@prisma/client";
import { jwtUtils } from "../../utils/jwt";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, role, image } = payload;

  // Admin role registration through public endpoint ঠিক না
  if (role === Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot register as ADMIN");
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      image,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: createdUser.id },
    omit: { password: true },
  });

  const jwtPayload = {
    id: createdUser.id,
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in } as SignOptions
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in } as SignOptions
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};


// user profile 

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    omit: { password: true },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateUserStatusInDB = async (userId: string, status: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You cannot modify status of an ADMIN");
  }

  const normalizedStatus = status.toUpperCase();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      status: normalizedStatus,
    },
    omit: { password: true },
  });

  return updatedUser;
};

export const userService = {
  registerUserIntoDB,
  getMe,
  getAllUsersFromDB,
  updateUserStatusInDB,
};