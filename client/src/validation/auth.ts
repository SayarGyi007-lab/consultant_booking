import * as z from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
})

export const registerSchema = z.object({
  firstName: z
    .string("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z
    .string("Email is required")
    .email("Invalid email address"),

  phone: z
    .string("Phone is required")
    .min(8,"Phone must be at least 8 digits")
    .max(15, "Phone must be less than 15 digits"),

  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters")
})