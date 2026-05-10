/**
 * Validates itinerary / note create bodies.
 */
import { AppError } from "../utils/AppError.js";
import {
  validateItineraryCreatePayload,
  validateTripNoteCreatePayload,
} from "../validators/tripDetails.validator.js";

export function validateCreateItineraryItem(req, _res, next) {
  const errors = validateItineraryCreatePayload(req.body);
  if (errors.length) {
    return next(new AppError(400, "Validation failed", errors));
  }
  next();
}

export function validateCreateTripNote(req, _res, next) {
  const errors = validateTripNoteCreatePayload(req.body);
  if (errors.length) {
    return next(new AppError(400, "Validation failed", errors));
  }
  next();
}
