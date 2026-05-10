/**
 * Validates trip create body; forwards failures as AppError(400).
 */
import { AppError } from "../utils/AppError.js";
import { validateTripCreatePayload } from "../validators/trip.validator.js";

export function validateCreateTrip(req, _res, next) {
  const errors = validateTripCreatePayload(req.body);
  if (errors.length) {
    return next(new AppError(400, "Validation failed", errors));
  }
  next();
}
