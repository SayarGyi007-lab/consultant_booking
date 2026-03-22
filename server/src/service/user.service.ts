import prisma from "../config/prisma.client";
import bcrypt from 'bcrypt'
import { IUpdateUser } from "../interface/IUser";
import { QueryOptions } from "../utils/pagination";
import { AppError } from "../utils/app-error";

class UserService {


    // Get all users (Admin)
    async getUsers(query: QueryOptions) {

        const { skip, limit, search, sortBy, order, status } = query; //add role if want to 

        const where = {} as any;

        // if (role) {
        //     where.role = role;
        // }

        if (status === "active") {
            where.deletedAt = null;
        }

        if (status === "archived") {
            where.deletedAt = { not: null };
        }

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                // { email: { contains: search, mode: "insensitive" } }
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: order
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    role: true,
                    createdAt: true
                }
            }),
            prisma.user.count({ where })
        ]);

        return { users, total };
    }

    // Get single user
    async getUserById(id: string) {

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        return user;
    }

    // Update user
    async updateUser(id: string, data: IUpdateUser) {

        const { password, ...updateData } = data;

        const user = await prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const updateUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return updateUser;
    }

    // Change password
    async changePassword(id: string, currentPassword: string, newPassword: string) {

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            throw new AppError("Current password incorrect", 401);
        }

        const samePassword = await bcrypt.compare(newPassword, user.password);

        if (samePassword) {
            throw new AppError("New password must be different", 400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        return { message: "Password updated successfully" };
    }

    // soft Delete user (Admin)
    async softDeleteUser(id: string) {

        const user = await prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new AppError("User not found", 404);
        }

        await prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date()
            }
        });

        return {
            success: true,
            message: "User archived"
        };
    }

    async restoreUser(id: string) {

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (!user.deletedAt) {
            throw new AppError("User is not archived", 400);
        }

        await prisma.user.update({
            where: { id },
            data: {
                deletedAt: null
            }
        });

        return {
            success: true,
            message: "User restored successfully"
        };
    }

    async permanentDeleteUser(id: string) {

        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
           throw new AppError("user not found", 404)
        }

        await prisma.user.delete({
            where: { id }
        });

        return {
            success: true,
            message: "User permanently deleted"
        };
    }

}

export default UserService;