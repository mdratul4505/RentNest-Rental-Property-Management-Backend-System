import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";

const createPropertyIntoDB = async (payload: any, landlordId: string) => {
  const result = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });
  return result;
};

const updatePropertyInDB = async (propertyId: string, payload: any, landlordId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this property");
  }

  const result = await prisma.property.update({
    where: { id: propertyId },
    data: payload,
  });
  return result;
};

const deletePropertyFromDB = async (propertyId: string, landlordId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to delete this property");
  }

  // Delete associated reviews & rentals to satisfy foreign key constraints
  await prisma.review.deleteMany({
    where: { propertyId },
  });

  await prisma.rentalRequest.deleteMany({
    where: { propertyId },
  });

  const result = await prisma.property.delete({
    where: { id: propertyId },
  });
  return result;
};

const getAllPropertiesFromDB = async (queryParams: any) => {
  const { location, minPrice, maxPrice, categoryId, amenities, searchTerm } = queryParams;

  const andConditions: any[] = [];

  // Public browse: show only available properties by default
  andConditions.push({ isAvailable: true });

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
        { location: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (location) {
    andConditions.push({
      location: { contains: location, mode: "insensitive" },
    });
  }

  if (minPrice !== undefined && minPrice !== "") {
    andConditions.push({
      price: { gte: Number(minPrice) },
    });
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    andConditions.push({
      price: { lte: Number(maxPrice) },
    });
  }

  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }

  if (amenities) {
    const amenityList = typeof amenities === "string" ? amenities.split(",") : amenities;
    if (Array.isArray(amenityList) && amenityList.length > 0) {
      andConditions.push({
        amenities: {
          hasEvery: amenityList.map((a: string) => a.trim()),
        },
      });
    }
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.property.findMany({
    where: whereConditions,
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getPropertyByIdFromDB = async (id: string) => {
  const result = await prisma.property.findUnique({
    where: { id },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  return result;
};

const getAllPropertiesForAdminFromDB = async () => {
  return await prisma.property.findMany({
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const propertyService = {
  createPropertyIntoDB,
  updatePropertyInDB,
  deletePropertyFromDB,
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
  getAllPropertiesForAdminFromDB,
};
