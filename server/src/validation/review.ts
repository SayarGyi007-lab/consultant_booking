import * as z from 'zod'

export const createReviewSchema = z.object({
  consultantId: z.string().uuid(),
  bookingId: z.string().uuid(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  comment: z.string().max(500).optional(),
});

export const updateReviewSchema = z.object({
  // consultantId: z.string().uuid(),
  // userId: z.string().uuid(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5")
    .optional(),

  comment: z.string().max(500).optional(),
});
