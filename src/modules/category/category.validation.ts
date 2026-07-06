import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Category name is required",
    }).min(1, "Category name cannot be empty"),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
};
