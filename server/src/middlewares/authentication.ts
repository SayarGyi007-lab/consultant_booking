import { Role } from "@prisma/client";
import { config } from "../config/config";
import prisma from "../config/prisma.client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/async-handler";
import generateTokens from "../utils/token";
import { AppError } from "../utils/app-error";

export interface AuthRequest extends Request {
    user?: {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string
        role: Role
    }
}


const protect = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {

        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken && !refreshToken) {
            res.status(401);
            throw new AppError("Unauthorized", 401);
        }

        try {

            const decoded = jwt.verify(accessToken, config.JWT_SECRET!) as JwtPayload;

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
                res.status(401);
                throw new AppError("Session expired", 401);
            }

            try {

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

                if (!user) {
                    res.status(401);
                    throw new AppError("User not found", 404);
                }

                // reuse your token generator
                generateTokens(res, user.id, user.role);

                req.user = user;

                next();

            } catch (error) {

                res.status(401);
                throw new AppError("Refresh token expired, please login again", 400);

            }
        }
    }
);

export { protect };