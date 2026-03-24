import { AppError } from "utils/app-error";
import { config } from "../config/config";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message,
    stack: config.NODE_ENVIRONMENT === "production" ? null : err.stack,
  });
};

export default errorHandler;