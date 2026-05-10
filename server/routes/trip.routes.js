/**
 * Trip routes — all handlers require JWT (applied when this router is mounted).
 */
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateCreateTrip,
  validateUpdateTrip,
} from "../middleware/validateTrip.middleware.js";
import {
  validateCreateItineraryItem,
  validateCreateTripNote,
} from "../middleware/validateTripDetails.middleware.js";
import {
  createTrip,
  listTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/trip.controller.js";
import {
  getTripDetails,
  createItineraryItem,
  createTripNote,
} from "../controllers/tripDetails.controller.js";

const router = Router();

router.post("/", validateCreateTrip, asyncHandler(createTrip));
router.get("/", asyncHandler(listTrips));
router.get("/:id/details", asyncHandler(getTripDetails));
router.post("/:id/itinerary", validateCreateItineraryItem, asyncHandler(createItineraryItem));
router.post("/:id/notes", validateCreateTripNote, asyncHandler(createTripNote));
router.get("/:id", asyncHandler(getTripById));
router.put("/:id", validateUpdateTrip, asyncHandler(updateTrip));
router.delete("/:id", asyncHandler(deleteTrip));

export default router;
