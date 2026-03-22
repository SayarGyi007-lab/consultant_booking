import * as z from "zod"

export const createTimeSlotSchema = z
    .object({
        consultantId: z
            .string()
            .min(1, "Consultant is required"),

        startTime: z
            .string()
            .min(1, "Start time is required"),

        endTime: z
            .string()
            .min(1, "End time is required")
    })
    .refine(
        (data) => new Date(data.endTime) > new Date(data.startTime),
        {
            message: "End time must be after start time",
            path: ["endTime"]
        }
    )


export const updateTimeSlotSchema = z
    .object({
        startTime: z
            .string()
            .min(1, "Start time is required")
            .optional(),

        endTime: z
            .string()
            .min(1, "End time is required")
            .optional()
    })
    .refine(
        (data) => {
            if (!data.startTime || !data.endTime) return true
            return new Date(data.endTime) > new Date(data.startTime)
        },
        {
            message: "End time must be after start time",
            path: ["endTime"]
        }
    )

export const createTimeSlotFormSchema = createTimeSlotSchema.extend({
  expertise: z.string().min(1, "Expertise is required") // temporary for the form
})