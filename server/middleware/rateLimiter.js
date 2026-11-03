// ─────────────────────────────────────────────
//  Cybreva — Rate limiter configurations
// ─────────────────────────────────────────────
import rateLimit from 'express-rate-limit';
import {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_GENERAL,
  RATE_LIMIT_MAX_AUTH,
  RATE_LIMIT_MAX_SCAN,
  RATE_LIMIT_MAX_AI,
} from '../constants/index.js';

const buildLimiter = (max, windowMs = RATE_LIMIT_WINDOW_MS, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.',
    },
    skipSuccessfulRequests: false,
  });

export const generalLimiter = buildLimiter(
  RATE_LIMIT_MAX_GENERAL,
  RATE_LIMIT_WINDOW_MS,
  'Too many requests from this IP. Please try again in 15 minutes.',
);

export const authLimiter = buildLimiter(
  RATE_LIMIT_MAX_AUTH,
  RATE_LIMIT_WINDOW_MS,
  'Too many authentication attempts. Please try again in 15 minutes.',
);

export const scanLimiter = buildLimiter(
  RATE_LIMIT_MAX_SCAN,
  RATE_LIMIT_WINDOW_MS,
  'Scan limit reached. Please try again in 15 minutes.',
);

export const aiLimiter = buildLimiter(
  RATE_LIMIT_MAX_AI,
  RATE_LIMIT_WINDOW_MS,
  'AI assistant request limit reached. Please try again in 15 minutes.',
);
