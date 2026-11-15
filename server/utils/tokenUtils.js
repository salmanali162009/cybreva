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

  // Cross-site HTTPS deployment detection:
  // Evaluates true if NODE_ENV=production, or CLIENT_URL is HTTPS, or running on Render
  const isHttpsDeployment =
    process.env.NODE_ENV === 'production' ||
    process.env.CLIENT_URL?.startsWith('https://') ||
    process.env.RENDER === 'true' ||
    Boolean(process.env.RENDER_SERVICE_ID) ||
    Boolean(process.env.RENDER_INSTANCE_ID);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttpsDeployment,                        // Required by browsers for SameSite=None
    sameSite: isHttpsDeployment ? 'none' : 'lax',     // Cross-origin between Vercel & Render
    partitioned: isHttpsDeployment,                  // CHIPS: Required for Chrome/Edge cross-site cookie handling
    maxAge: expireDays * 24 * 60 * 60 * 1000,        // milliseconds
    path: '/',
  });
};

/**
 * Clear the auth cookie (logout).
 */
export const clearTokenCookie = (res) => {
  const isHttpsDeployment =
    process.env.NODE_ENV === 'production' ||
    process.env.CLIENT_URL?.startsWith('https://') ||
    process.env.RENDER === 'true' ||
    Boolean(process.env.RENDER_SERVICE_ID) ||
    Boolean(process.env.RENDER_INSTANCE_ID);

  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: isHttpsDeployment,
    sameSite: isHttpsDeployment ? 'none' : 'lax',
    partitioned: isHttpsDeployment,
    expires: new Date(0),
    path: '/',
  });
};
