import { prisma } from "../../lib/prisma";

const createCategoryIntoDB = async (payload: { name: string }) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return result;
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
};
