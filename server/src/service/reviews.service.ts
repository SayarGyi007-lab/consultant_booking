import { AppError } from "../utils/app-error";
import prisma from "../config/prisma.client";
import { ICreateReview, IUpdateReview } from "../interface/ICreateReview";
import { QueryOptions } from "../utils/pagination";
import consultantService from "./consultant.service";
import { bumpVersion, getVersion } from "../utils/cache-version";
import { getCache, setCache } from "../utils/cache";

class ReviewService {
    async createReview(data: ICreateReview) {

        const { bookingId, userId, consultantId, rating, comment } = data;

        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId,
                userId,
                status: "COMPLETED"
            },
            include: {
                slot: true
            }
        });

        if (!booking) {
            throw new AppError("You can only review completed bookings", 400);
        }

        if (booking.slot.consultantId !== consultantId) {
            throw new AppError("Invalid consultant for this booking", 400);
        }

        const existing = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (existing) {
            throw new AppError("You already reviewed this booking", 409);
        }

        const review = await prisma.review.create({
            data: {
                bookingId,
                userId,
                consultantId,
                rating,
                comment: comment || null
            }
        });

        await consultantService.updateConsultantRating(consultantId);

        await bumpVersion("reviews:version")
        await bumpVersion("consultant:version")

        return review;
    }

    async updateReview(bookingId: string, userId: string, data: IUpdateReview) {
        const review = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (!review) {
            throw new AppError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw new AppError("Unauthorized", 403);
        }

        const updated = await prisma.review.update({
            where: { bookingId },
            data
        });

        await consultantService.updateConsultantRating(review.consultantId);

        await bumpVersion("reviews:version")
        await bumpVersion("consultant:version")

        return updated;
    }

    async deleteReview(bookingId: string, userId: string) {
        const review = await prisma.review.findUnique({
            where: { bookingId }
        });

        if (!review) {
            throw new AppError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw new AppError("Unauthorized", 403);
        }

        await prisma.review.delete({
            where: { bookingId }
        });

        await consultantService.updateConsultantRating(review.consultantId);

        await bumpVersion("reviews:version")
        await bumpVersion("consultant:version")
        return true;
    }

    async getReviewsByConsultant(consultantId: string, query: QueryOptions) {
        const version = await getVersion("reviews:version");

        const cacheKey = `reviews:v${version}:${consultantId}:${JSON.stringify(query)}`;

        const cached = await getCache(cacheKey);

        if (cached) {
            console.log("cache hit reviews");
            return cached;
        }

        console.log("cache miss reviews");

        const { skip, limit, sortBy, order, page } = query;

        const where = {
            consultantId,
        };

        // ✅ BUILD QUERY SAFELY (no undefined fields)
        const findOptions: any = {
            where,
            orderBy: {
                [sortBy]: order,
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        };

        // ✅ ONLY add pagination if limit !== 0
        if (limit !== 0) {
            findOptions.skip = skip;
            findOptions.take = limit;
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany(findOptions),
            prisma.review.count({ where }),
        ]);

        const result = {
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
            },
        };

        await setCache(cacheKey, result, 60);

        return result;
    }
}



export default ReviewService