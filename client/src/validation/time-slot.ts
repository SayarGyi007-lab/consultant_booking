import * as z from "zod"

export const createTimeSlotSchema = z.object({
  consultantId: z
    .string()
    .min(1, "Consultant is required"),

  startTime: z
    .string()
    .min(1, "Start time is required"),
  // ✅ endTime removed — backend calculates it
});

export const updateTimeSlotSchema = z.object({
  startTime: z
    .string()
    .min(1, "Start time is required")
    .optional(),
  // ✅ endTime removed — backend calculates it
});

export const createTimeSlotFormSchema = createTimeSlotSchema.extend({
  expertise: z.string().optional() // ✅ optional since it's just for filtering
});