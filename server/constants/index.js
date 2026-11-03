// ─────────────────────────────────────────────
//  Cybreva — Application-wide constants
// ─────────────────────────────────────────────

export const RISK_LEVELS = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  UNKNOWN: 'UNKNOWN',
});

export const SCAN_TYPES = Object.freeze({
  MESSAGE: 'message',
  EMAIL: 'email',
  WEBSITE: 'website',
});

export const USER_ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

export const COOKIE_NAME = 'cybreva_token';

export const MAX_CHAT_HISTORY = 20; // max messages kept in context

// Groq model — overridden via GROQ_MODEL env var
// Use a broadly available model; update GROQ_MODEL in .env for account-specific models
export const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';

// Rate-limit windows (milliseconds)
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_MAX_GENERAL = 100;
export const RATE_LIMIT_MAX_AUTH = 20;
export const RATE_LIMIT_MAX_SCAN = 30;
export const RATE_LIMIT_MAX_AI = 15;

// Body-size limit
export const BODY_SIZE_LIMIT = '50kb';

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

// Disclaimer appended to every AI-generated assessment
export const AI_DISCLAIMER =
  'This assessment is AI-generated and provided for informational purposes only. ' +
  'It does not constitute professional security advice and should not be treated as ' +
  'a definitive determination of safety or threat. Always exercise independent judgment.';
