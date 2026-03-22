import * as z from 'zod'

export const createUserSchema = z.object({
  firstName: z
    .string("First name is required" )
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string("Last name is required" )
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z
    .string("Email is required" )
    .email("Invalid email format"),

  phone: z
    .string("Phone number is required" )
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must be less than 15 digits"),

  password: z
    .string("Password is required" )
    .min(6, "Password must be at least 6 characters"),

});

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
    .email("Invalid email format")
    .optional(),

  phone: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must be less than 15 digits")
    .optional(),

});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),

  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
});