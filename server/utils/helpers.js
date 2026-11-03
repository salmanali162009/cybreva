// ─────────────────────────────────────────────
//  Cybreva — Utility helpers
// ─────────────────────────────────────────────

/**
 * Send a standardised success response.
 */
export const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({ success: true, message, data });
};

/**
 * Send a standardised error response.
 */
export const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = []) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

/**
 * Async handler wrapper — eliminates try/catch boilerplate in controllers.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validate a MongoDB ObjectId string.
 */
export const isValidObjectId = (id) => {
  return /^[a-f\d]{24}$/i.test(String(id));
};

/**
 * Build a safe pagination object from query params.
 */
export const getPagination = (query, maxLimit = 50) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Strip sensitive fields from a user document.
 */
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return obj;
};

/**
 * Safe logger — never logs token or password values.
 */
export const safeLog = (label, data) => {
  const REDACT = ['password', 'token', 'secret', 'authorization', 'cookie'];
  const sanitized = JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (REDACT.some((r) => key.toLowerCase().includes(r))) return '[REDACTED]';
      return value;
    }),
  );
  console.log(`[${label}]`, sanitized);
};
