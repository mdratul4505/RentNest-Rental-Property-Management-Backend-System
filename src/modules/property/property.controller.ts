import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req.user!.id;
  const result = await propertyService.createPropertyIntoDB(req.body, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property listing created successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const landlordId = req.user!.id;
  const result = await propertyService.updatePropertyInDB(id, req.body, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property listing updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const landlordId = req.user!.id;
  const result = await propertyService.deletePropertyFromDB(id, landlordId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property listing removed successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.getAllPropertiesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await propertyService.getPropertyByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property details retrieved successfully",
    data: result,
  });
});

const getAllPropertiesForAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await propertyService.getAllPropertiesForAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All properties retrieved successfully for Admin",
    data: result,
  });
});

export const propertyController = {
  createProperty,
  updateProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  getAllPropertiesForAdmin,
};
