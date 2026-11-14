// ─────────────────────────────────────────────
//  Cybreva — Centralized Risk Assessment Engine
//  "Check Before You Trust."
// ─────────────────────────────────────────────

import { RISK_LEVELS, AI_DISCLAIMER } from '../../constants/index.js';

/**
 * Risk Threshold Bands:
 * 0–24:   low
 * 25–49:  medium
 * 50–74:  high
 * 75–100: critical
 */
export const RISK_THRESHOLDS = Object.freeze({
  LOW_MAX: 24,
  MEDIUM_MAX: 49,
  HIGH_MAX: 74,
  CRITICAL_MAX: 100,
});

/**
 * Maps a numeric score (0–100) to a validated risk level string.
 * Returns 'unknown' for null, undefined, NaN, or negative values.
 */
export const scoreToRiskLevel = (score) => {
  if (score === null || score === undefined || typeof score !== 'number' || isNaN(score) || score < 0) {
    return RISK_LEVELS.UNKNOWN;
  }
  if (score >= 75) return RISK_LEVELS.CRITICAL;
  if (score >= 50) return RISK_LEVELS.HIGH;
  if (score >= 25) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

/**
 * Verifies that riskScore and riskLevel are mathematically aligned.
 * Returns normalized { riskScore, riskLevel }.
 */
export const ensureRiskConsistency = (score, level) => {
  if (level === RISK_LEVELS.UNKNOWN || score === null || score === undefined) {
    return { riskScore: null, riskLevel: RISK_LEVELS.UNKNOWN };
  }

  const numericScore = Math.max(0, Math.min(100, Math.round(score)));
  const computedLevel = scoreToRiskLevel(numericScore);

  return {
    riskScore: numericScore,
    riskLevel: computedLevel,
  };
};

/**
 * Weighted Indicator Definitions.
 * Weights:
 *   CRITICAL: 50 (1 critical indicator immediately pushes into High/Critical risk)
 *   HIGH:     30 (2 high indicators push into High/Critical risk)
 *   MEDIUM:   15 (2 medium push into Medium risk)
 *   LOW:      8
 */
export const INDICATOR_WEIGHTS = Object.freeze({
  CRITICAL: 50,
  HIGH: 30,
  MEDIUM: 15,
  LOW: 8,
});

/**
 * Pattern detectors for text content (messages, email bodies, subject lines).
 */
export const TEXT_INDICATOR_RULES = [
  // ── CRITICAL SEVERITY ──────────────────────
  {
    id: 'OTP_REQUEST',
    severity: 'CRITICAL',
    label: 'OTP / Secret Verification Code Solicitation',
    regex: /(?:send|share|tell|give|enter|forward|reply with).{0,25}(?:otp|one.?time.?password|2fa|verification code|pin code|\b\d{4,8}\b code)|do not (?:share|show|tell) this (?:code|otp|pin)/i,
  },
  {
    id: 'PASSWORD_SOLICITATION',
    severity: 'CRITICAL',
    label: 'Password or Security Credential Solicitation',
    regex: /(?:enter|verify|confirm|send|submit|update).{0,30}(?:your password|login credentials|security questions|master key|private key|seed phrase)/i,
  },
  {
    id: 'CRYPTO_WIRE_EXTORTION',
    severity: 'CRITICAL',
    label: 'Demands Cryptocurrency or Untraceable Wire Transfer',
    regex: /(?:send|transfer|pay|deposit).{0,30}(?:bitcoin|btc|usdt|eth|ethereum|crypto|gift card|western union|moneygram)|pay into (?:this|our) (?:bitcoin|btc|wallet) address/i,
  },
  {
    id: 'LEGAL_ARREST_THREAT',
    severity: 'CRITICAL',
    label: 'Arrest Warrant or Law Enforcement Threat Under Pressure',
    regex: /(?:arrest warrant|law enforcement|federal police|interpol|fbi agent|irs court order|legal action against you).{0,50}(?:immediate|within \d+ hours?|pay now|face arrest)/i,
  },
  {
    id: 'ADVANCE_FEE_INHERITANCE',
    severity: 'CRITICAL',
    label: 'Advance-Fee / Inheritance / Consignment Payout Scam',
    regex: /(?:inheritance fund|consignment box|unclaimed funds|beneficiary|barrister|prince|diplomatic courier).{0,50}(?:million dollar|fund transfer|release fee|processing fee)/i,
  },

  // ── HIGH SEVERITY ──────────────────────────
  {
    id: 'ACCOUNT_SUSPENSION_URGENT',
    severity: 'HIGH',
    label: 'Urgent Account Suspension Threat',
    regex: /(?:your (?:account|card|access|subscription|wallet|profile) (?:has been|will be|is) (?:suspended|locked|blocked|terminated|closed|disabled)).{0,50}(?:click|verify|within \d+|immediately|act now)/i,
  },
  {
    id: 'FAKE_PRIZE_LOTTERY',
    severity: 'HIGH',
    label: 'Unsolicited Prize, Lottery, or Reward Claim',
    regex: /(?:you (?:have won|were chosen|are selected|won a prize)|lottery winner|cash prize of|claim your free (?:gift|reward|voucher|iphone|funds))/i,
  },
  {
    id: 'BANK_DATA_REQUEST',
    severity: 'HIGH',
    label: 'Bank Account or Card Details Solicitation',
    regex: /(?:enter|confirm|verify|provide).{0,30}(?:bank account|credit card|cvv|expiry date|routing number|debit card number)/i,
  },
  {
    id: 'BRAND_IMPERSONATION',
    severity: 'HIGH',
    label: 'Brand Impersonation Indicator (Financial / Tech Provider)',
    regex: /\b(?:paypal|apple security|google security|microsoft support|netflix billing|amazon security|chase alert|wells fargo alert|bank of america alert)\b/i,
  },
  {
    id: 'RAW_IP_URL',
    severity: 'HIGH',
    label: 'Raw Numeric IP Address in Message or Link',
    regex: /https?:\/\/(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/|\b)/i,
  },
  {
    id: 'SHORTENED_URL',
    severity: 'HIGH',
    label: 'Obfuscated or Shortened URL Service',
    regex: /https?:\/\/(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|shorturl\.at|is\.gd|buff\.ly|rebrand\.ly)\/[a-zA-Z0-9_\-]+/i,
  },

  // ── MEDIUM SEVERITY ────────────────────────
  {
    id: 'PRESSURE_TACTIC',
    severity: 'MEDIUM',
    label: 'Urgency and Pressure Tactics',
    regex: /\b(?:urgent|act immediately|time sensitive|expires in \d+ (?:hours?|minutes?)|immediate action required|respond now)\b/i,
  },
  {
    id: 'UNSOLICITED_LINK_CLICK',
    severity: 'MEDIUM',
    label: 'Unsolicited Prompt to Click Link',
    regex: /\b(?:click (?:here|the link below|this url)|tap (?:here|the link)|follow (?:the link|instructions here))\b/i,
  },
  {
    id: 'FALSE_SECURITY_ALERT',
    severity: 'MEDIUM',
    label: 'Unusual Activity or Security Alert Claim',
    regex: /\b(?:unusual (?:activity|login|sign.?in)|unauthorized access detected|security alert on your)\b/i,
  },
  {
    id: 'GENERIC_DATA_CONFIRMATION',
    severity: 'MEDIUM',
    label: 'Generic Identity or Billing Confirmation Request',
    regex: /\b(?:verify your identity|confirm your billing details|update your profile details to avoid)\b/i,
  },

  // ── LOW SEVERITY ───────────────────────────
  {
    id: 'GENERIC_CALL_TO_ACTION',
    severity: 'LOW',
    label: 'Unusual Promotional or Action Call',
    regex: /\b(?:exclusive offer|limited time only|act now before it is gone)\b/i,
  },
];

/**
 * Detect text indicators using the weighted rules.
 * Returns array of { id, severity, label, weight }.
 */
export const detectWeightedIndicators = (text) => {
  if (!text || typeof text !== 'string') return [];
  const normalized = text.trim();
  const matched = [];
  const seenIds = new Set();

  for (const rule of TEXT_INDICATOR_RULES) {
    if (rule.regex.test(normalized)) {
      if (!seenIds.has(rule.id)) {
        seenIds.add(rule.id);
        matched.push({
          id: rule.id,
          severity: rule.severity,
          label: rule.label,
          weight: INDICATOR_WEIGHTS[rule.severity] || INDICATOR_WEIGHTS.MEDIUM,
        });
      }
    }
  }

  return matched;
};

/**
 * Calculate numeric risk score from matched indicators.
 * If no indicators: returns 0 (Low Risk).
 * Single critical indicator: starts at 60 (High Risk), two critical >= 85 (Critical).
 */
export const calculateWeightedScore = (indicators = []) => {
  if (!indicators || indicators.length === 0) {
    return 0;
  }

  let totalWeight = 0;
  let hasCritical = false;
  let hasHigh = false;

  for (const ind of indicators) {
    totalWeight += ind.weight || 15;
    if (ind.severity === 'CRITICAL') hasCritical = true;
    if (ind.severity === 'HIGH') hasHigh = true;
  }

  let score = 0;
  if (hasCritical) {
    // Starts at minimum 65 (High Risk band) and scales with remaining indicators
    score = Math.min(98, 65 + (indicators.length - 1) * 12);
  } else if (hasHigh) {
    // Starts at minimum 40 (Medium) or 55 (High if 2+)
    score = Math.min(92, 40 + (indicators.length - 1) * 15);
  } else {
    // Medium / Low indicators
    score = Math.min(65, indicators.length * 14);
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Heuristic URL threat analysis (checks domain, TLD, brand impersonation, path).
 */
const SUSPICIOUS_TLDS = new Set([
  'xyz', 'top', 'click', 'buzz', 'fit', 'tk', 'ml', 'ga', 'cf', 'gq',
  'work', 'rest', 'country', 'live', 'loan', 'cam', 'surf', 'bar', 'icu',
]);

const KNOWN_BRANDS = [
  'paypal', 'apple', 'google', 'microsoft', 'amazon', 'netflix',
  'chase', 'wellsfargo', 'bankofamerica', 'binance', 'coinbase', 'metamask',
  'facebook', 'instagram', 'whatsapp', 'telegram', 'steam',
];

export const analyzeUrlHeuristics = (urlStr) => {
  const indicators = [];
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const fullPath = hostname + pathname;

    // 1. Raw IP check
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      indicators.push({
        id: 'URL_RAW_IP',
        severity: 'HIGH',
        label: 'Direct numeric IP used instead of domain name',
        weight: INDICATOR_WEIGHTS.HIGH,
      });
    }

    // 2. Suspicious TLD check
    const parts = hostname.split('.');
    const tld = parts[parts.length - 1];
    if (SUSPICIOUS_TLDS.has(tld)) {
      indicators.push({
        id: 'URL_SUSPICIOUS_TLD',
        severity: 'HIGH',
        label: `High-risk / abused top-level domain (.${tld})`,
        weight: INDICATOR_WEIGHTS.HIGH,
      });
    }

    // 3. Brand impersonation in domain
    for (const brand of KNOWN_BRANDS) {
      if (hostname.includes(brand)) {
        // Legitimate domain check
        const isLegit =
          hostname === `${brand}.com` ||
          hostname.endsWith(`.${brand}.com`) ||
          hostname === `${brand}.org` ||
          hostname.endsWith(`.${brand}.org`);

        if (!isLegit) {
          indicators.push({
            id: 'URL_BRAND_IMPERSONATION',
            severity: 'CRITICAL',
            label: `Brand impersonation in domain name (${brand})`,
            weight: INDICATOR_WEIGHTS.CRITICAL,
          });
          break;
        }
      }
    }

    // 4. Phishing keywords in URL path / parameters
    if (/(?:login|signin|verify|account-update|security-check|banking|wallet-connect|password-reset)/.test(fullPath)) {
      indicators.push({
        id: 'URL_PHISHING_PATH',
        severity: 'HIGH',
        label: 'Suspicious credential or verification path in URL',
        weight: INDICATOR_WEIGHTS.HIGH,
      });
    }

    // 5. Excessive subdomains
    if (parts.length >= 5) {
      indicators.push({
        id: 'URL_EXCESSIVE_SUBDOMAINS',
        severity: 'MEDIUM',
        label: 'Unusually complex subdomain nesting',
        weight: INDICATOR_WEIGHTS.MEDIUM,
      });
    }

    // 6. Punycode / IDN homograph indicator
    if (hostname.includes('xn--')) {
      indicators.push({
        id: 'URL_PUNYCODE_HOMOGRAPH',
        severity: 'HIGH',
        label: 'Punycode internationalized domain (potential homograph impersonation)',
        weight: INDICATOR_WEIGHTS.HIGH,
      });
    }
  } catch {
    // Malformed URL will be caught by validator
  }

  return indicators;
};

/**
 * Generates tailored recommendations based on risk level and detected indicators.
 */
export const buildStandardRecommendations = (riskLevel, indicators = []) => {
  const baseAdvice = [
    'Verify the sender through an official, independent channel before taking action.',
    'Never share passwords, PINs, OTP codes, or financial information through unsolicited messages.',
    'Check URLs carefully for misspellings before clicking.',
  ];

  if (riskLevel === RISK_LEVELS.CRITICAL) {
    return [
      'DO NOT interact, reply, or click any links in this content.',
      'Block and report the sender immediately.',
      'If you have already shared credentials or payment details, immediately contact your bank and reset your accounts.',
      'Scan your device for malware if an attachment or link was opened.',
      ...baseAdvice,
    ];
  }

  if (riskLevel === RISK_LEVELS.HIGH) {
    return [
      'Strong scam indicators detected. Avoid engaging with the sender.',
      'Do not click any embedded links or provide requested information.',
      'Contact the alleged organization directly using their official website or phone number.',
      ...baseAdvice,
    ];
  }

  if (riskLevel === RISK_LEVELS.MEDIUM) {
    return [
      'Exercise caution — some suspicious patterns or pressure tactics were observed.',
      'Confirm the authenticity of the message before replying or clicking.',
      ...baseAdvice,
    ];
  }

  if (riskLevel === RISK_LEVELS.UNKNOWN) {
    return [
      'Assessment could not be definitively completed due to limited or unavailable telemetry.',
      'Exercise independent judgment and verify the source directly.',
      ...baseAdvice,
    ];
  }

  // Low Risk
  return [
    'No known scam patterns or threat intelligence matches were detected.',
    'Remain vigilant — new scams and targeted attacks may not trigger common filters.',
    ...baseAdvice,
  ];
};

/**
 * Creates the standard structured result required across all scanners.
 */
export const createStandardResult = ({
  riskScore,
  riskLevel,
  detectedIndicators = [],
  aiAnalysis = '',
  recommendations = [],
  assessmentStatus = 'completed',
  assessmentLimitations = [],
  disclaimer = AI_DISCLAIMER,
  metadata = {},
}) => {
  // Ensure score and level are mathematically consistent
  const consistent = ensureRiskConsistency(riskScore, riskLevel);

  return {
    riskScore: consistent.riskScore,
    riskLevel: consistent.riskLevel,
    detectedIndicators: detectedIndicators.map((i) => (typeof i === 'string' ? i : i.label || String(i))),
    aiAnalysis: aiAnalysis || 'Analysis complete.',
    summary: aiAnalysis || 'Analysis complete.', // alias for backward compatibility
    recommendations:
      recommendations.length > 0
        ? recommendations
        : buildStandardRecommendations(consistent.riskLevel, detectedIndicators),
    assessmentStatus,
    assessmentLimitations,
    disclaimer,
    ...metadata,
  };
};
