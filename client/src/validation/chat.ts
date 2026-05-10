// src/validation/chat.ts
import * as z from "zod";

export const sendMessageSchema = z.object({
  sessionId: z.string().uuid().optional(),
  content: z.string().min(1).max(2000),
});