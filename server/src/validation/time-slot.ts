import * as z from 'zod'
import { slotStatusEnum } from './enum';

export const createTimeSlotSchema = z.object({
  consultantId: z
    .string("Consultant ID is required" )
    .uuid("Consultant ID must be a valid UUID"),

  startTime: z
    .string("Start time is required" )
    .datetime("Start time must be a valid ISO datetime"),

  endTime: z
    .string( "End time is required" )
    .datetime("End time must be a valid ISO datetime"),

  status: slotStatusEnum.optional()
});

export const updateTimeSlotSchema = z.object({

  startTime: z
    .string("Start time is required" )
    .datetime("Start time must be a valid ISO datetime")
    .optional(),

  endTime: z
    .string( "End time is required" )
    .datetime("End time must be a valid ISO datetime")
    .optional(),

  status: slotStatusEnum.optional()
});