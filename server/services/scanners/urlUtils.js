// ─────────────────────────────────────────────
//  Cybreva — URL safety utilities
// ─────────────────────────────────────────────

import { AppError } from '../../utils/AppError.js';

// Private/reserved CIDR ranges (IPv4)
const PRIVATE_RANGES = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  /^192\.168\./,
  /^127\./,       // loopback
  /^169\.254\./,  // link-local
  /^0\./,         // unspecified
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./,  // CGNAT
];

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '0.0.0.0',
  '::1',
  '[::1]',
]);

/**
 * Parse and validate a URL string.
 * Returns the URL object if valid; throws AppError otherwise.
 */
export const parseAndValidateUrl = (rawUrl) => {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new AppError('The provided URL is malformed or invalid.', 400);
  }

  // Only allow http and https
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new AppError(
      `URL scheme "${parsed.protocol.replace(':', '')}" is not supported. Only HTTP and HTTPS URLs are accepted.`,
      400,
    );
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and internal hostnames
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    throw new AppError('Scanning of localhost or internal addresses is not permitted.', 400);
  }

  // Block private IPv4 ranges
  for (const range of PRIVATE_RANGES) {
    if (range.test(hostname)) {
      throw new AppError('Scanning of private or internal IP addresses is not permitted.', 400);
    }
  }

  return parsed;
};

/**
 * Normalise a URL: lowercase hostname, strip trailing slash, strip fragment.
 */
export const normalizeUrl = (rawUrl) => {
  const parsed = parseAndValidateUrl(rawUrl);
  // Remove fragment, normalise host to lowercase
  return `${parsed.protocol}//${parsed.hostname}${parsed.port ? ':' + parsed.port : ''}${parsed.pathname}${parsed.search}`;
};
