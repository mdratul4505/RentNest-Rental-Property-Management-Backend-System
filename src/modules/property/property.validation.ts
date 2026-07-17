import { z } from "zod";

const createPropertyValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }).min(1),
    description: z.string({ message: "Description is required" }).min(1),
    location: z.string({ message: "Location is required" }).min(1),
    price: z.number({ message: "Price is required" }).int("Price must be an integer").positive("Price must be positive"),
    amenities: z.array(z.string()).min(1, "At least one amenity is required"),
    categoryId: z.string({ message: "CategoryId is required" }),
  }),
});

const updatePropertyValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    price: z.number().int("Price must be an integer").positive("Price must be positive").optional(),
    amenities: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    isAvailable: z.boolean().optional(),
  }),
});

export const PropertyValidation = {
  createPropertyValidationSchema,
  updatePropertyValidationSchema,
};
