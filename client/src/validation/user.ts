import * as z from "zod"

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
})

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .optional(),

  email: z
    .string()
    .email("Invalid email")
    .optional(),

  phone: z
    .string()
    .min(8,"Phone must be at least 8 digits")
    .max(15, "Phone must be less than 15 digits")
    .optional()
})