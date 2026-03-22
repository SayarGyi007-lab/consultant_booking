import { Request } from "express";

export interface QueryOptions {
    page: number;
    limit: number;
    skip: number;
    search?: string;
    // role?: string;
    sortBy: string;
    order: "asc" | "desc";
    expertise?: string;
    status?: string
}

export const buildQuery = (req: Request): QueryOptions => {
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    // const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 20);
    // const skip = (page - 1) * limit;

    const rawLimit = parseInt(req.query.limit as string);

    let limit: number;
    if (rawLimit === 0) {
        limit = 0; 
    } else {
        limit = Math.min(Math.max(rawLimit || 10, 1), 20);
    }

    const skip = limit === 0 ? 0 : (page - 1) * limit;

    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = (req.query.order as "asc" | "desc") || "desc";

    const query: QueryOptions = {
        page,
        limit,
        skip,
        sortBy,
        order
    };

    if (req.query.search) {
        query.search = req.query.search as string;
    }

    // if (req.query.role) {
    //     query.role = req.query.role as string;
    // }

    if (req.query.expertise) {
        query.expertise = req.query.expertise as string;
    }

    if (req.query.status) {
        query.status = req.query.status as string;
    }

    return query;
};