import * as z from "zod";

export const roleEnum = z.enum(
  ["ADMIN", "USER", "CONSULTANT"],
);

export const slotStatusEnum = z.enum(
  ["AVAILABLE", "BOOKED"],
)