import prisma from "../config/prisma.client";
import { IUser } from "../interface/IUser";
import bcrypt from 'bcrypt'
import generateTokens from "../utils/token";
import { Response } from "express";
import { AppError } from "../utils/app-error";
import { bumpVersion } from "../utils/cache-version";


class AuthService{
    // Register user
    async register(data: IUser) {

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email }
                ]
            }
        });

        if (existingUser) {
            throw new AppError("User with email already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                password: hashedPassword,
            }
        });

        await bumpVersion("users:version");
        await bumpVersion("user:version"); 

        return user;
    }

    // Login user
    async login(email: string, password: string, res: Response) {

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new AppError("Invalid email or password", 401);
        }

        generateTokens(res, user.id, user.role);

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
    }

    // Logout
    async logout(res: Response) {

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return { message: "Logged out successfully" };
    }
}

export default AuthService;