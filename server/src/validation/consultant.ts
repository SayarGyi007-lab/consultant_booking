

// export const createConsultantSchema = z.object({
//   firstName: z
//     .string("First name is required" )
//     .min(2, "First name must be at least 2 characters")
//     .max(50, "First name must be less than 50 characters"),

//   lastName: z
//     .string( "Last name is required" )
//     .min(2, "Last name must be at least 2 characters")
//     .max(50, "First name must be less than 50 characters"),

//   email: z
//     .string("Email is required" )
//     .email("Invalid email format"),

//   phone: z
//     .string("Phone number is required" )
//     .min(8, "Phone must be at least 8 digits")
//     .max(15, "Phone must be less than 15 digits"),

//   expertise: z
//     .string("Expertise is required" )
//     .min(3, "Expertise must be at least 3 characters"),

// });

import * as z from "zod";

export const createConsultantSchema = z.object({
  firstName: z
    .string({ message: "First name is required" })
    .min(2)
    .max(50),

  lastName: z
    .string({ message: "Last name is required" })
    .min(2)
    .max(50),

  email: z
    .string({ message: "Email is required" })
    .email(),

  phone: z
    .string({ message: "Phone is required" })
    .regex(/^[0-9]+$/, "Phone must contain only digits")
    .min(8)
    .max(15),

  expertise: z
    .string({ message: "Expertise is required" })
    .min(3),

  bio: z.string({ message: "Expertise is required" })
    .max(500),

  skills: z.array(z.string({ message: "Expertise is required" })),

  price: z.number().positive("Price must be greater than 0"),

  experience: z.number({ message: "Expertise is required" })
    .int()
      .min(1)
      .max(50),
});

export const updateConsultantSchema = z.object({

  firstName: z.string()
    .min(2)
    .max(50)
    .optional(),

  lastName: z.string()
    .min(2)
    .max(50)
    .optional(),

  email: z.string()
    .email()
    .optional(),

  phone: z
    .string()
    .regex(/^[0-9]+$/, "Phone must contain only digits")
    .min(8)
    .max(15)
    .optional(),

  expertise: z.string()
    .min(3)
    .optional(),

  bio: z.string()
    .max(500)
    .optional(),

  price: z.number().positive("Price must be greater than 0").optional(),

  skills: z.array(z.string())
    .optional(),

  experience: z.number()
    .int()
    .min(0)
    .max(50)
    .optional(),

});