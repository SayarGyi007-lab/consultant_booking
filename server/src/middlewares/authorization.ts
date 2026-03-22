import { NextFunction, Response } from "express";
import { AuthRequest } from "./authentication";
import { AppError } from "../utils/app-error";
import { Role } from "@prisma/client";

export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    if (!req.user || req.user.role !== "ADMIN") {
        res.status(403);
        throw new AppError("Admin access required", 403);
    }

    next();
};


export const userOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    if (!req.user || req.user.role !== "USER") {
        res.status(403);
        throw new AppError("User access required",403);
    }

    next();
};

export const Both = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {

    if (!req.user || req.user.role !== "USER" && req.user.role !== "ADMIN") {
        res.status(403);
        throw new AppError("Access required",403);
    }

    next();
};

// export const allowRoles = (...roles: Role[]) => {
//   return (req: AuthRequest, _res: Response, next: NextFunction) => {

//     if (!req.user || !roles.includes(req.user.role)) {
//       throw new AppError("Forbidden", 403);
//     }

//     next();
//   };
// };