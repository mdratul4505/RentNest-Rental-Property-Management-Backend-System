import bcrypt from "bcryptjs";
import { SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config/index.js";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";
import { ILoginUser } from "./auth.interface";

const loginUser = async (payload : ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where : {email}
    });

    if (user.status && user.status.toUpperCase() === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if(!isPasswordMatched){
        throw new AppError(httpStatus.UNAUTHORIZED, "Password is incorrect");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
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
        accessToken,
        refreshToken
    };
};

const socialLogin = async (payload: { email: string; name: string; image?: string; provider?: string; role?: string }) => {
    const { email, name, image, role } = payload;

    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        const hashedPassword = await bcrypt.hash(`SocialPass_${email}_rentnest`, 10);
        const assignedRole = (role && role.toUpperCase() === "LANDLORD") ? "LANDLORD" : "TENANT";
        user = await prisma.user.create({
            data: {
                name: name || "Social User",
                email,
                password: hashedPassword,
                role: assignedRole as any,
                image: image || "",
            }
        });
    }

    if (user.status && user.status.toUpperCase() === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
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
        accessToken,
        refreshToken,
        user
    };
};

const refreshToken = async (token: string) => {
    let decoded;
    try {
        decoded = jwtUtils.verifyToken(token, config.jwt_refresh_secret as string) as any;
    } catch (err) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Refresh Token");
    }

    const { email } = decoded;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    });

    if (user.status && user.status.toUpperCase() === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        { expiresIn: config.jwt_access_expires_in } as SignOptions
    );

    return {
        accessToken
    };
};

export const authService = {
    loginUser,
    socialLogin,
    refreshToken,
};