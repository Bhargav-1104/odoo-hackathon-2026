/**
 * Validation rules for trip payloads (create). Pure functions → reusable in tests.
 */

const MAX_TITLE = 255;
const MAX_DESCRIPTION = 10_000;

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isIsoDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/**
 * @param {unknown} body
 * @returns {{ field: string, message: string }[]}
 */
export function validateTripCreatePayload(body) {
  const errors = [];

  if (body === null || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }

  const { title, description, start_date, end_date, budget } = body;

  if (typeof title !== "string" || !title.trim()) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (title.length > MAX_TITLE) {
    errors.push({ field: "title", message: `Title must be at most ${MAX_TITLE} characters` });
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      errors.push({ field: "description", message: "Description must be a string" });
    } else if (description.length > MAX_DESCRIPTION) {
      errors.push({
        field: "description",
        message: `Description must be at most ${MAX_DESCRIPTION} characters`,
      });
    }
  }

  if (typeof start_date !== "string" || !start_date.trim()) {
    errors.push({ field: "start_date", message: "Start date is required" });
  } else if (!isIsoDateString(start_date.trim())) {
    errors.push({ field: "start_date", message: "Start date must be YYYY-MM-DD" });
  }

  if (typeof end_date !== "string" || !end_date.trim()) {
    errors.push({ field: "end_date", message: "End date is required" });
  } else if (!isIsoDateString(end_date.trim())) {
    errors.push({ field: "end_date", message: "End date must be YYYY-MM-DD" });
  }

  if (
    errors.every((e) => e.field !== "start_date" && e.field !== "end_date") &&
    typeof start_date === "string" &&
    typeof end_date === "string" &&
    isIsoDateString(start_date.trim()) &&
    isIsoDateString(end_date.trim()) &&
    end_date.trim() < start_date.trim()
  ) {
    errors.push({ field: "end_date", message: "End date must be on or after start date" });
  }

  if (budget === undefined || budget === null) {
    errors.push({ field: "budget", message: "Budget is required" });
  } else if (typeof budget === "number") {
    if (!Number.isFinite(budget) || budget < 0) {
      errors.push({ field: "budget", message: "Budget must be a non-negative number" });
    }
  } else if (typeof budget === "string") {
    if (!budget.trim()) {
      errors.push({ field: "budget", message: "Budget is required" });
    } else {
      const n = Number(budget);
      if (!Number.isFinite(n) || n < 0) {
        errors.push({ field: "budget", message: "Budget must be a non-negative number" });
      }
    }
  } else {
    errors.push({ field: "budget", message: "Budget must be a non-negative number" });
  }

  return errors;
}
