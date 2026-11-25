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
    id: 'GUARANTEED_INVESTMENT_RETURNS',
    severity: 'CRITICAL',
    label: 'Guaranteed Unrealistic Investment Returns',
    regex: /(?:guaranteed\s+(?:returns?|profits?|payouts?|income|yield|\$\d+|[0-9]+%)|invest\s+(?:just\s+|only\s+)?\$?\d+[\s\S]{0,50}(?:receive|get|earn|make|payout)[\s\S]{0,30}\$?\d+|turn\s+\$?\d+\s+into\s+\$?\d+|double\s+your\s+(?:money|investment|crypto|funds|cash|deposit)|(?:100%|daily|weekly|hourly)\s+guaranteed\s+(?:returns?|profit)|high\s*yield\s*investment\s*program)/i,
  },
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
    regex: /(?:send|transfer|pay|deposit).{0,35}(?:bitcoin|btc|usdt|eth|ethereum|crypto|cryptocurrency|gift card|western union|moneygram|cashapp|cash app|venmo|zelle)|pay into (?:this|our) (?:bitcoin|btc|wallet) address/i,
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
    id: 'NO_RISK_CLAIM',
    severity: 'HIGH',
    label: 'No-Risk / 100% Risk-Free Guarantee',
    regex: /\b(?:no\s+risk|zero\s+risk|100%\s+risk[- ]free|risk[- ]free\s+(?:investment|trading|opportunity|returns?)|no\s+experience\s+(?:needed|required|necessary)|no\s+loss\s+guarantee)\b/i,
  },
  {
    id: 'UNREALISTIC_PROFIT_PROMISE',
    severity: 'HIGH',
    label: 'Unrealistic Profit Promise or Rapid Wealth Scheme',
    regex: /(?:earn\s+\$?\d+\s+(?:daily|per day|hourly|a day|every day|per week)|passive\s+income\s+(?:daily|guaranteed)|make\s+money\s+(?:fast|instantly|overnight)|get\s+rich\s+(?:quick|fast)|instant\s+(?:profit|withdrawal|cashout))/i,
  },
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
    label: 'Artificial Urgency and Pressure Tactics',
    regex: /\b(?:urgent|act\s+immediately|time\s+sensitive|expires?\s+in\s+\d+\s+(?:hours?|minutes?|days?)|within\s+\d+\s+(?:hours?|minutes?|days?)|immediate\s+action\s+required|respond\s+now|limited\s+(?:opportunity|offer|spots?|time|availability)|only\s+\d+\s+(?:slots?|spots?|seats?)\s+left|act\s+fast\s+before|last\s+chance|before\s+it'?s\s+too\s+late|hurry\s+up)\b/i,
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
    regex: /\b(?:exclusive offer|act now before it is gone)\b/i,
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

/**
 * Synthesizes heuristic indicators and AI analysis into a unified, mathematically consistent assessment.
 * Prevents contradictions where AI flags high risk but score stays 0/low.
 * Also handles AI unavailability according to security requirements (never defaulting to fake 0/low).
 */
export const synthesizeScanAssessment = ({
  heuristicIndicators = [],
  aiResult = null,
  scanType = 'message',
  disclaimer = AI_DISCLAIMER,
  metadata = {},
  fallbackLimitations = [],
}) => {
  // 1. Compile heuristic indicators into a label map
  const indicatorMap = new Map();
  for (const ind of heuristicIndicators) {
    const label = typeof ind === 'string' ? ind : ind.label;
    if (label) {
      indicatorMap.set(label.toLowerCase(), {
        label,
        severity: ind.severity || 'MEDIUM',
        weight: ind.weight || INDICATOR_WEIGHTS.MEDIUM,
      });
    }
  }

  // 2. Base heuristic calculation
  const heuristicScore = calculateWeightedScore(heuristicIndicators);
  const heuristicLevel = scoreToRiskLevel(heuristicScore);

  // 3. Process AI results
  const isAiAvailable = !!(aiResult && aiResult.available !== false);
  const structured = aiResult?.structured || null;

  let assessmentStatus = 'completed';
  const assessmentLimitations = [...fallbackLimitations];

  if (!isAiAvailable) {
    assessmentStatus = 'partial';
    assessmentLimitations.push(
      'AI deep analysis is temporarily unavailable; results are based on deterministic heuristic detection.'
    );
  }

  // 4. Ingest AI detected indicators if present
  if (structured?.detectedIndicators && Array.isArray(structured.detectedIndicators)) {
    for (const rawAiInd of structured.detectedIndicators) {
      if (typeof rawAiInd === 'string' && rawAiInd.trim()) {
        const cleanInd = rawAiInd.trim();
        const key = cleanInd.toLowerCase();
        if (!indicatorMap.has(key)) {
          indicatorMap.set(key, {
            label: cleanInd,
            severity: 'HIGH',
            weight: INDICATOR_WEIGHTS.HIGH,
          });
        }
      }
    }
  }

  const finalIndicators = Array.from(indicatorMap.values()).map((i) => i.label);

  // 5. Dual-score reconciliation and synthesis
  let finalScore = heuristicScore;
  let finalLevel = heuristicLevel;

  if (isAiAvailable) {
    const aiScore =
      structured?.riskScore !== null &&
      structured?.riskScore !== undefined &&
      typeof structured.riskScore === 'number' &&
      !isNaN(structured.riskScore)
        ? Math.max(0, Math.min(100, Math.round(structured.riskScore)))
        : null;

    const aiLevel =
      structured?.riskLevel && typeof structured.riskLevel === 'string'
        ? structured.riskLevel.toLowerCase()
        : null;

    // A. Reconcile based on AI threat identification
    if (aiLevel === RISK_LEVELS.CRITICAL || (aiScore !== null && aiScore >= 75)) {
      const minCritical = aiScore !== null ? Math.max(aiScore, 75) : 85;
      finalScore = Math.max(finalScore, minCritical);
    } else if (aiLevel === RISK_LEVELS.HIGH || (aiScore !== null && aiScore >= 50)) {
      const minHigh = aiScore !== null ? Math.max(aiScore, 50) : 65;
      finalScore = Math.max(finalScore, minHigh);
    } else if (aiLevel === RISK_LEVELS.MEDIUM || (aiScore !== null && aiScore >= 25)) {
      const minMedium = aiScore !== null ? Math.max(aiScore, 25) : 35;
      finalScore = Math.max(finalScore, minMedium);
    } else if (heuristicIndicators.length === 0 && (aiLevel === RISK_LEVELS.LOW || (aiScore !== null && aiScore < 25))) {
      // Both heuristics and AI agree there are no threats
      finalScore = aiScore !== null ? Math.min(15, aiScore) : 0;
    }

    // B. Heuristic severity floors — static evidence of threat cannot be downgraded by AI
    finalScore = Math.max(finalScore, heuristicScore);
    if (heuristicLevel === RISK_LEVELS.CRITICAL) {
      finalScore = Math.max(finalScore, 75);
    } else if (heuristicLevel === RISK_LEVELS.HIGH) {
      finalScore = Math.max(finalScore, 50);
    }

    finalLevel = scoreToRiskLevel(finalScore);
  } else {
    // AI is unavailable
    if (heuristicIndicators.length === 0) {
      // Unassessed / unknown: never return fake 0 or false low risk
      finalScore = null;
      finalLevel = RISK_LEVELS.UNKNOWN;
      assessmentStatus = 'partial';
      assessmentLimitations.push(
        'Assessment could not be definitively completed: AI analysis service was unavailable and no deterministic scam patterns were matched.'
      );
    } else {
      // Retain heuristic score
      finalScore = heuristicScore;
      finalLevel = heuristicLevel;
    }
  }

  // 6. Explanation
  let aiAnalysis = '';
  if (isAiAvailable) {
    aiAnalysis =
      structured?.explanation ||
      aiResult?.text ||
      (finalIndicators.length > 0
        ? `Threat indicators identified: ${finalIndicators.join(', ')}.`
        : 'No scam patterns or malicious indicators detected in this content.');
  } else {
    aiAnalysis =
      heuristicIndicators.length > 0
        ? `Assessment based on heuristic detection (${heuristicIndicators.length} threat indicator(s) found). AI deep analysis was unavailable.`
        : 'Assessment could not be completed because the AI analysis service was unavailable and no deterministic scam signatures were detected.';
  }

  // 7. Recommendations
  let recommendations = [];
  if (structured?.recommendations && Array.isArray(structured.recommendations) && structured.recommendations.length > 0) {
    recommendations = structured.recommendations;
  } else {
    recommendations = buildStandardRecommendations(finalLevel, finalIndicators);
  }

  return createStandardResult({
    riskScore: finalScore,
    riskLevel: finalLevel,
    detectedIndicators: finalIndicators,
    aiAnalysis,
    recommendations,
    assessmentStatus,
    assessmentLimitations,
    disclaimer,
    metadata,
  });
};
