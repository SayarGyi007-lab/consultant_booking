import { config } from "../config/config";
import prisma from "../config/prisma.client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler";
import generateTokens from "../utils/token";
import { AppError } from "../utils/app-error";
import { redis } from "../config/redis";


export interface AuthRequest extends Request {
    user?: {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string | null
        role: "USER" | "ADMIN"
    }
}

const protect = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {

        // Read from Authorization header instead of cookies
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        // Read refresh token from request body or custom header
        const refreshToken = req.headers["x-refresh-token"] as string;

        if (!accessToken && !refreshToken) {
            throw new AppError("Unauthorized", 401);
        }

        try {

            const isBlacklisted = await redis.get(`bl:${accessToken}`);
            if (isBlacklisted) {
                throw new AppError("Token is blacklisted", 401);
            }

            const decoded = jwt.verify(accessToken!, config.JWT_SECRET!) as JwtPayload;

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true
                }
            });

            if (!user) throw new AppError("User not found", 404);

            req.user = user;
            return next();

        } catch (err) {

            if (!refreshToken) {
                throw new AppError("Session expired", 401);
            }

            try {

                const stored = await redis.get(`rt:${refreshToken}`);
                if (!stored) {
                    throw new AppError("Invalid refresh token", 401);
                }
                const decoded = jwt.verify(
                    refreshToken,
                    config.JWT_REFRESH_SECRET!
                ) as JwtPayload;

                const user = await prisma.user.findUnique({
                    where: { id: decoded.id },
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        role: true
                    }
                });

                if (!user) throw new AppError("User not found", 404);

                // Generate new tokens and send back in response header
                // so frontend can update localStorage
                const tokens = generateTokens(user.id, user.role);
                res.setHeader("x-access-token", tokens.accessToken);
                res.setHeader("x-refresh-token", tokens.refreshToken);

                req.user = user;
                next();

            } catch (error) {
                throw new AppError("Refresh token expired, please login again", 401);
            }
        }
    }
);

export { protect };