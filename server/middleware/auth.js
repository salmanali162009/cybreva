// ─────────────────────────────────────────────
//  Cybreva — Middleware: Authentication
// ─────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/helpers.js';
import { COOKIE_NAME } from '../constants/index.js';

/**
 * Protects routes — must be logged in.
 */
export const protect = asyncHandler(async (req, res, next) => {
  // Read token from HTTP-only cookie
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    throw new AppError('You are not logged in. Please log in to get access.', 401);
  }

  // Verify the token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please log in again.', 401);
    }
    throw new AppError('Invalid authentication token. Please log in again.', 401);
  }

  // Check that the user still exists
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = user;
  next();
});

/**
 * Restricts access to specific roles.
 */
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
