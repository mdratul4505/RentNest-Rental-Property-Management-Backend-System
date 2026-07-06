import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalRequestService } from "./rentalRequest.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.user!.id;
  const result = await rentalRequestService.createRentalRequestIntoDB(req.body, tenantId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request submitted successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  let result;
  if (role === "TENANT") {
    result = await rentalRequestService.getTenantRentalsFromDB(userId);
  } else {
    result = await rentalRequestService.getLandlordRentalsFromDB(userId);
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const role = req.user!.role;

  const result = await rentalRequestService.getRentalRequestByIdFromDB(id, userId, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request details retrieved successfully",
    data: result,
  });
});

const getLandlordRequests = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user!.id;
  const result = await rentalRequestService.getLandlordRentalsFromDB(landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Landlord property rental requests retrieved successfully",
    data: result,
  });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const landlordId = req.user!.id;

  const result = await rentalRequestService.updateRentalRequestStatusInDB(id, status, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Rental request status updated to ${status} successfully`,
    data: result,
  });
});

const getAllRentalsForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await rentalRequestService.getAllRentalsForAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All rental requests retrieved successfully for Admin",
    data: result,
  });
});

export const rentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestById,
  getLandlordRequests,
  updateRentalRequestStatus,
  getAllRentalsForAdmin,
};
