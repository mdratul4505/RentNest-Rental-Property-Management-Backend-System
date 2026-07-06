import { prisma } from "../../lib/prisma";
import { RentalStatus } from "../../../generated/prisma";

const createReviewIntoDB = async (
  payload: { propertyId: string; rating: number; comment: string },
  userId: string
) => {
  const { propertyId, rating, comment } = payload;

  const rental = await prisma.rentalRequest.findFirst({
    where: {
      propertyId,
      tenantId: userId,
      status: {
        in: [RentalStatus.ACTIVE, RentalStatus.COMPLETED],
      },
    },
  });

  if (!rental) {
    throw new Error(
      "You can only review properties that you have rented with active or completed status"
    );
  }

  const result = await prisma.review.create({
    data: {
      propertyId,
      userId,
      rating,
      comment,
    },
    include: {
      property: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return result;
};

export const reviewService = {
  createReviewIntoDB,
};
