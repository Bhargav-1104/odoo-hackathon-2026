/**
 * Validation for itinerary items and trip notes.
 */

const MAX_TITLE = 255;
const MAX_ITINERARY_NOTES = 10_000;
const MAX_TRIP_NOTE = 50_000;

/**
 * @param {unknown} body
 * @returns {{ field: string, message: string }[]}
 */
export function validateItineraryCreatePayload(body) {
  const errors = [];

  if (body === null || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }

  const { title, day_number, notes } = body;

  if (typeof title !== "string" || !title.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (title.length > MAX_TITLE) {
    errors.push({ field: "title", message: `Title must be at most ${MAX_TITLE} characters` });
  }

  if (day_number === undefined || day_number === null) {
    errors.push({ field: "day_number", message: "day_number is required" });
  } else {
    const day = typeof day_number === "number" ? day_number : Number(day_number);
    if (!Number.isInteger(day) || day < 1) {
      errors.push({ field: "day_number", message: "day_number must be an integer >= 1" });
    }
  }

  if (notes !== undefined && notes !== null) {
    if (typeof notes !== "string") {
      errors.push({ field: "notes", message: "notes must be a string" });
    } else if (notes.length > MAX_ITINERARY_NOTES) {
      errors.push({
        field: "notes",
        message: `notes must be at most ${MAX_ITINERARY_NOTES} characters`,
      });
    }
  }

  return errors;
}

/**
 * @param {unknown} body
 * @returns {{ field: string, message: string }[]}
 */
export function validateTripNoteCreatePayload(body) {
  const errors = [];

  if (body === null || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }

  const { content } = body;

  if (typeof content !== "string" || !content.trim()) {
    errors.push({ field: "content", message: "content is required" });
  } else if (content.length > MAX_TRIP_NOTE) {
    errors.push({
      field: "content",
      message: `content must be at most ${MAX_TRIP_NOTE} characters`,
    });
  }

  return errors;
}
