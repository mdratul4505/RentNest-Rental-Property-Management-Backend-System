import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../errors/AppError";
import { RentalStatus } from "../../../generated/prisma";

const createRentalRequestIntoDB = async (payload: { propertyId: string; moveInDate: string }, tenantId: string) => {
  const { propertyId, moveInDate } = payload;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (!property.isAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "Property is not available for rent");
  }

  const result = await prisma.rentalRequest.create({
    data: {
      propertyId,
      tenantId,
      moveInDate: new Date(moveInDate),
      status: RentalStatus.PENDING,
    },
    include: {
      property: true,
    },
  });

  return result;
};

const getTenantRentalsFromDB = async (tenantId: string) => {
  return await prisma.rentalRequest.findMany({
    where: { tenantId },
    include: {
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getLandlordRentalsFromDB = async (landlordId: string) => {
  return await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getRentalRequestByIdFromDB = async (id: string, userId: string, role: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (role === "TENANT" && rental.tenantId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this rental request");
  }

  if (role === "LANDLORD" && rental.property.landlordId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to view this rental request");
  }

  return rental;
};

const updateRentalRequestStatusInDB = async (id: string, status: RentalStatus, landlordId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: true,
    },
  });

  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rental.property.landlordId !== landlordId) {
    throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this rental request");
  }

  if (rental.status !== RentalStatus.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot change status of a request that is already ${rental.status}`);
  }

  const result = await prisma.rentalRequest.update({
    where: { id },
    data: { status },
  });

  return result;
};

const getAllRentalsForAdminFromDB = async () => {
  return await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const rentalRequestService = {
  createRentalRequestIntoDB,
  getTenantRentalsFromDB,
  getLandlordRentalsFromDB,
  getRentalRequestByIdFromDB,
  updateRentalRequestStatusInDB,
  getAllRentalsForAdminFromDB,
};
