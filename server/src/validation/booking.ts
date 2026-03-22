import * as z from "zod";

export const createBookingSchema = z.object({
  slotId: z
    .string("Slot ID is required" )
    .uuid("Slot ID must be a valid UUID"),

  userId: z
    .string()
    .uuid("User ID must be a valid UUID")
    .optional(),

  customerName: z
    .string("Customer name is required" )
    .min(2, "Customer name must be at least 2 characters"),

  customerEmail: z
    .string("Customer email is required")
    .email("Invalid email format")
});