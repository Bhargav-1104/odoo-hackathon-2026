/**
 * Pure validation for auth payloads. Returns structured field errors for 400 responses.
 * Keeps rules in one place so routes and tests share the same definitions.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;

/**
 * @param {unknown} body
 * @returns {{ field: string, message: string }[]}
 */
export function validateSignupPayload(body) {
  const errors = [];

  if (body === null || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }

  const { name, email, password } = body;

  if (typeof name !== "string" || !name.trim()) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (name.trim().length > MAX_NAME_LENGTH) {
    errors.push({ field: "name", message: `Name must be at most ${MAX_NAME_LENGTH} characters` });
  }

  if (typeof email !== "string" || !email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (email.length > MAX_EMAIL_LENGTH) {
    errors.push({ field: "email", message: `Email must be at most ${MAX_EMAIL_LENGTH} characters` });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (typeof password !== "string") {
    errors.push({ field: "password", message: "Password is required" });
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }

  return errors;
}

/**
 * @param {unknown} body
 * @returns {{ field: string, message: string }[]}
 */
export function validateLoginPayload(body) {
  const errors = [];

  if (body === null || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be a JSON object" }];
  }

  const { email, password } = body;

  if (typeof email !== "string" || !email.trim()) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (typeof password !== "string" || !password) {
    errors.push({ field: "password", message: "Password is required" });
  }

  return errors;
}

export function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}
