/**
 * Centralized error handling: AppError → client-safe JSON; unknown errors → 500 + log.
 * Must be registered after all routes (last middleware).
 */
import { AppError } from "../utils/AppError.js";

export function notFoundHandler(req, res, next) {
  next(new AppError(404, `Not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors?.length ? { errors: err.errors } : {}),
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
