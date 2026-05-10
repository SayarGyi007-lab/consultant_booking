import * as z from "zod";

export const createReviewSchema = z.object({
  consultantId: z.string().uuid(),
  bookingId: z.string().uuid(),

  rating: z
    .number()
    .int()
    .min(1, "Minimum 1 star")
    .max(5, "Maximum 5 stars"),

  comment: z
    .string()
    .max(500, "Max 500 characters")
    .optional(),
});

export const updateReviewSchema = z.object({
  bookingId: z.string().uuid(),

  rating: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional(),

  comment: z.string().max(500).optional(),
});