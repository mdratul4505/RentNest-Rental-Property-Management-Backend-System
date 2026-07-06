import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes, landlordPropertyRoutes } from "./modules/property/property.route";
import { rentalRoutes, landlordRentalRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(cors({
  origin: config.app_url,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/landlord/properties", landlordPropertyRoutes);
app.use("/api/landlord/requests", landlordRentalRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API Route Not Found",
    errorDetails: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;