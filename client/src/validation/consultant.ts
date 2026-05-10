import * as z from "zod"


export const createConsultantSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string({ message: "Last name is required" })
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email"),

  phone: z
    .string({ message: "Phone is required" })
    .regex(/^[0-9]+$/, "Phone must contain only digits")
    .min(8, "Phone must be at least 8 digits")
    .max(15, "Phone must be less than 15 digits"),

  expertise: z
    .string({ message: "Expertise is required" })
    .min(3, "Expertise must be at least 3 characters"),

  bio: z
    .string({ message: "Bio is required" })
    .min(5, "Bio must be at least 5 characters")
    .max(500, "Bio must be less than 500 characters"),

  skills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "At least one skill is required"),

  price: z.number().positive("Price must be greater than 0"),

  experience: z
    .number({ message: "Experience is required" })
    .int("Experience must be a whole number")
    .min(1, "Minimum 1 year")
    .max(50, "Maximum 50 years"),
})

export const updateConsultantSchema = z.object({
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
    .regex(/^[0-9]+$/, "Phone must contain only digits")
    .min(8, "Phone must be at least 8 digits")
    .max(15, "Phone must be less than 15 digits")
    .optional(),

  expertise: z
    .string()
    .min(3, "Expertise must be at least 3 characters")
    .optional(),

  bio: z
    .string()
    .min(5, "Bio must be at least 5 characters")
    .max(500, "Bio must be less than 500 characters")
    .optional(),

  skills: z
    .array(z.string().min(1))
    .min(1, "At least one skill is required")
    .optional(),

  price: z.number().positive("Price must be greater than 0").optional(),

  experience: z
    .number()
    .int("Must be a whole number")
    .min(1, "Minimum 1 year")
    .max(50, "Maximum 50 years")
    .optional(),
})