// ─────────────────────────────────────────────
//  Cybreva — Centralised error handler
// ─────────────────────────────────────────────
import { AppError } from '../utils/AppError.js';

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 400);

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue?.[field] || '';
  return new AppError(
    `Duplicate value for ${field}: "${value}". Please use a different value.`,
    409,
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new AppError('Validation failed', 400, errors);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert known Mongoose errors into AppErrors
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log server errors (but not 4xx operational errors in production)
  if (statusCode >= 500) {
    console.error('[ERROR]', {
      message: err.message,
      stack: isProduction ? undefined : err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    errors: error.errors || [],
    // Only include stack in development
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

export default errorHandler;
