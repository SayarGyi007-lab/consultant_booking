import * as z from "zod";

export const createConsultantSchema = z.object({
  firstName: z
    .string("First name is required" )
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string( "Last name is required" )
    .min(2, "Last name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  email: z
    .string("Email is required" )
    .email("Invalid email format"),

  phone: z
    .string("Phone number is required" )
    .min(8, "Phone must be at least 8 digits")
    .max(15, "Phone must be less than 15 digits"),

  expertise: z
    .string("Expertise is required" )
    .min(3, "Expertise must be at least 3 characters"),

});

export const updateConsultantSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .optional(),

  email: z
    .string()
    .email("Invalid email format")
    .optional(),

  phone: z
    .string()
    .min(8, "Phone must be at least 8 digits")
    .max(15, "Phone must be less than 15 digits")
    .optional(),

  expertise: z
    .string()
    .min(3, "Expertise must be at least 3 characters")
    .optional(),

});