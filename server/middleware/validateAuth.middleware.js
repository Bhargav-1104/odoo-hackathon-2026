/**
 * Runs signup/login validators and forwards validation failures as AppError(400).
 */
import { AppError } from "../utils/AppError.js";
import {
  validateSignupPayload,
  validateLoginPayload,
} from "../validators/auth.validator.js";

export function validateSignup(req, _res, next) {
  const errors = validateSignupPayload(req.body);
  if (errors.length) {
    return next(new AppError(400, "Validation failed", errors));
  }
  next();
}

export function validateLogin(req, _res, next) {
  const errors = validateLoginPayload(req.body);
  if (errors.length) {
    return next(new AppError(400, "Validation failed", errors));
  }
  next();
}
