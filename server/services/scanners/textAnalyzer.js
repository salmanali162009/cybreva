// ─────────────────────────────────────────────
//  Cybreva — Scam detection: shared helpers
// ─────────────────────────────────────────────

/**
 * Deterministic scam indicator checks applied to text content.
 * Returns an array of matched indicator strings.
 */
export const detectTextIndicators = (text) => {
  const t = text.toLowerCase();
  const indicators = [];

  const patterns = [
    { regex: /urgent|act now|immediate(ly)?|expires? (today|soon|in \d+ hours?)/i, label: 'Urgency / pressure tactic' },
    { regex: /verify your (account|identity|email|password|details|information)/i, label: 'Credential verification request' },
    { regex: /click (here|the link|below)|tap (here|the link)/i, label: 'Unsolicited click-link prompt' },
    { regex: /you('ve| have) (won|been selected|been chosen|been awarded)/i, label: 'Unsolicited prize or reward claim' },
    { regex: /free (gift|prize|money|iphone|reward|voucher)/i, label: 'Unrealistic free offer' },
    { regex: /send (me )?(your )?(money|payment|bitcoin|crypto|gift card)/i, label: 'Payment or money transfer request' },
    { regex: /gift card|itunes card|amazon card|google play card/i, label: 'Gift card payment request' },
    { regex: /bank (account|transfer|details)/i, label: 'Bank account information request' },
    { regex: /password|pin|ssn|social security|national id/i, label: 'Sensitive personal data request' },
    { regex: /irs|hmrc|fbi|interpol|police|court order|arrest warrant/i, label: 'Authority impersonation indicator' },
    { regex: /lottery|jackpot|million dollar|billion dollar/i, label: 'Lottery or jackpot scam indicator' },
    { regex: /nigerian|prince|inheritance|unclaimed funds/i, label: 'Advance-fee / inheritance scam indicator' },
    { regex: /your (account|card|subscription) (has been|will be) (suspended|cancelled|blocked|locked)/i, label: 'Account suspension threat' },
    { regex: /confirm your (details|information|billing|card)/i, label: 'Data confirmation request' },
    { regex: /unusual (activity|sign.?in|login) detected/i, label: 'False security alert' },
    { regex: /https?:\/\/[^\s]*(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|shorturl|rebrand\.ly)/i, label: 'Shortened / obfuscated URL' },
    { regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, label: 'Raw IP address in message' },
    { regex: /do not (share|tell|show) this (code|otp|pin|password)/i, label: 'OTP / secret code solicitation' },
  ];

  for (const { regex, label } of patterns) {
    if (regex.test(text) || regex.test(t)) {
      if (!indicators.includes(label)) indicators.push(label);
    }
  }

  return indicators;
};

/**
 * Calculate a numeric risk score (0–100) from a list of indicators.
 */
export const calculateRiskScore = (indicators) => {
  // Base: 5 points per indicator, capped at 95, minimum of 5
  const raw = Math.min(95, indicators.length * 12);
  return Math.max(5, raw);
};

/**
 * Map a numeric score to a RISK_LEVEL string.
 */
export const scoreToRiskLevel = (score) => {
  if (score >= 70) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  return 'LOW';
};

/**
 * Build standard recommendations based on risk level.
 */
export const buildRecommendations = (riskLevel, indicators = []) => {
  const base = [
    'Do not click unsolicited links.',
    'Never share passwords, PINs, OTPs, or banking details over messages.',
    'Verify the sender through an official channel before responding.',
  ];

  if (riskLevel === 'HIGH') {
    return [
      'Do NOT engage with this message.',
      'Block and report the sender.',
      'If personal data was shared, contact your bank and relevant authorities immediately.',
      ...base,
    ];
  }

  if (riskLevel === 'MEDIUM') {
    return [
      'Exercise caution before responding.',
      'Verify the sender through official channels.',
      ...base,
    ];
  }

  return base;
};
