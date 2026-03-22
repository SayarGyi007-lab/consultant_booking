import * as z from "zod"

export const createBookingSchema = z.object({
  // slotId: z
  //   .string()
  //   .min(1, "Slot is required"),

  customerName: z
    .string("Customer name is required")
    .min(2, "Customer name must be at least 2 characters"),

  customerEmail: z
    .string("Customer email is required")
    .email("Invalid email")
})