// ─────────────────────────────────────────────
//  Cybreva — JWT token utilities
// ─────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from '../constants/index.js';

/**
 * Generate a signed JWT for the given user id.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Attach the JWT as an HTTP-only cookie on the response.
 */
export const sendTokenCookie = (res, token) => {
  const expireDays = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,           // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: expireDays * 24 * 60 * 60 * 1000, // milliseconds
    path: '/',
  });
};

/**
 * Clear the auth cookie (logout).
 */
export const clearTokenCookie = (res) => {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
};
