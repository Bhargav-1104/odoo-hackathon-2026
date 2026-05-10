/**
 * Operational errors with HTTP status codes for the global error handler.
 * Use this for expected failures (validation, conflicts, auth) instead of generic Error.
 */
export class AppError extends Error {
  /**
   * @param {number} statusCode - HTTP status
   * @param {string} message - Safe client-facing message
   * @param {{ field: string, message: string }[] | undefined} errors - Optional field-level details
   */
  constructor(statusCode, message, errors) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
