import { Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "../utils/app-error";
import { AuthRequest } from "../middlewares/authentication";
import ReviewService from "../service/reviews.service";
import { buildQuery } from "../utils/pagination";

const reviewService = new ReviewService();

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const review = await reviewService.createReview({
    ...req.body,
    userId, // ✅ FIX: inject userId
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

export const updateReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const { bookingId, rating, comment } = req.body;

  const updated = await reviewService.updateReview(
    bookingId,
    userId,
    { rating, comment }
  );

  res.json({
    success: true,
    data: updated,
  });
});

export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const { bookingId } = req.params as { bookingId: string };

  await reviewService.deleteReview(bookingId, userId);

  res.json({
    success: true,
    message: "Review deleted successfully",
  });
});

export const getReviewsByConsultant = asyncHandler( async (req: AuthRequest, res: Response) => {
    const { consultantId } = req.params as {consultantId: string};

    const query = buildQuery(req);

    const result = await reviewService.getReviewsByConsultant(
      consultantId,
      query
    );

    res.json({
      success: true,
      ...result,
    });
  }
);