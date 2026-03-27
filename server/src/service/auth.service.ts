import prisma from "../config/prisma.client";
import { IUser } from "../interface/IUser";
import bcrypt from 'bcrypt'
import generateTokens from "../utils/token";
import jwt from 'jsonwebtoken'
import { AppError } from "../utils/app-error";
import { bumpVersion } from "../utils/cache-version";
import { redis } from "../config/redis";
import { config } from "../config/config";


class AuthService {
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
    async login(email: string, password: string) {
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

        if (user.deletedAt !== null) {
            throw new AppError("User is banned", 400);
        }

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);

        // store refresh token only
        await redis.set(
            `rt:${refreshToken}`,
            user.id.toString(),
            "EX",
            7 * 24 * 60 * 60
        );

        return {
            accessToken,
            refreshToken,
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
    }

    // Logout
    async logout(accessToken: string, refreshToken: string) {
        let decoded: any;

        try {
            decoded = jwt.verify(accessToken, config.JWT_SECRET!);
        } catch {
            throw new AppError("Invalid or expired access token", 401);
        }

        if (!decoded?.exp) {
            throw new AppError("Invalid token payload", 400);
        }

        //  check refresh token exists
        const stored = await redis.get(`rt:${refreshToken}`);
        if (!stored) {
            throw new AppError("Invalid refresh token", 401);
        }

        const expiresIn = Math.max(
            decoded.exp - Math.floor(Date.now() / 1000),
            0
        );

        // blacklist access token
        await redis.set(
            `bl:${accessToken}`,
            "true",
            "EX",
            expiresIn
        );

        // delete refresh token (logout session)
        await redis.del(`rt:${refreshToken}`);

        return true;
    }

    async refresh(refreshToken: string) {
    let decoded: any;

    try {
        decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET!);
    } catch {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const stored = await redis.get(`rt:${refreshToken}`);

    if (!stored) {
        throw new AppError("Refresh token not recognized", 401);
    }

    //rotate token
    await redis.del(`rt:${refreshToken}`);

    const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(decoded.id, decoded.role);

    await redis.set(
        `rt:${newRefreshToken}`,
        decoded.id.toString(),
        "EX",
        7 * 24 * 60 * 60
    );

    return {
        accessToken,
        refreshToken: newRefreshToken
    };
}
}

export default AuthService;