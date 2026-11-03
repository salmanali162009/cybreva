// ─────────────────────────────────────────────
//  Cybreva — Auth controller
// ─────────────────────────────────────────────
import crypto from 'crypto';
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler, sanitizeUser, sendSuccess } from '../utils/helpers.js';
import { generateToken, sendTokenCookie, clearTokenCookie } from '../utils/tokenUtils.js';
import {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/index.js';

// ── Register ──────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const data = validate(registerSchema, req.body);

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create(data);
  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  return sendSuccess(res, 201, 'Account created successfully.', { user: sanitizeUser(user) });
});

// ── Login ─────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const data = validate(loginSchema, req.body);

  // Explicitly select password for comparison
  const user = await User.findOne({ email: data.email }).select('+password');
  if (!user || !(await user.comparePassword(data.password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  return sendSuccess(res, 200, 'Logged in successfully.', { user: sanitizeUser(user) });
});

// ── Logout ────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  return sendSuccess(res, 200, 'Logged out successfully.');
});

// ── Get current user ──────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError('User not found.', 404);
  return sendSuccess(res, 200, 'User retrieved successfully.', { user: sanitizeUser(user) });
});

// ── Update profile ────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const data = validate(updateProfileSchema, req.body);

  // Check email uniqueness if changing email
  if (data.email && data.email !== req.user.email) {
    const exists = await User.findOne({ email: data.email });
    if (exists) throw new AppError('This email address is already in use.', 409);
  }

  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, 'Profile updated successfully.', { user: sanitizeUser(user) });
});

// ── Change password ───────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const data = validate(changePasswordSchema, req.body);

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(data.currentPassword))) {
    throw new AppError('Current password is incorrect.', 400);
  }

  user.password = data.newPassword;
  await user.save();

  // Re-issue token after password change
  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  return sendSuccess(res, 200, 'Password changed successfully.');
});

// ── Forgot password ───────────────────────────
// Uses generic response to avoid email-enumeration attacks
export const forgotPassword = asyncHandler(async (req, res) => {
  const data = validate(forgotPasswordSchema, req.body);

  const user = await User.findOne({ email: data.email });

  if (user) {
    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // In production, send resetToken via email.
    // Here we log only in development to assist testing.
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV] Password reset token:', resetToken);
    }
  }

  // Always return the same message regardless of whether the email exists
  return sendSuccess(
    res,
    200,
    'If an account with that email exists, a password reset link has been sent.',
  );
});

// ── Reset password ────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const data = validate(resetPasswordSchema, req.body);

  const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    throw new AppError('Password reset token is invalid or has expired.', 400);
  }

  user.password = data.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  return sendSuccess(res, 200, 'Password reset successfully.');
});
