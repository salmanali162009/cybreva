// ─────────────────────────────────────────────
//  Cybreva — Scam detection: text analyzer
//  Delegates to centralized riskEngine.js
// ─────────────────────────────────────────────

import {
  detectWeightedIndicators,
  calculateWeightedScore,
  scoreToRiskLevel as engineScoreToRiskLevel,
  buildStandardRecommendations,
  analyzeUrlHeuristics,
  createStandardResult,
} from './riskEngine.js';

/**
 * Returns plain string array of detected indicators for backwards compatibility.
 */
export const detectTextIndicators = (text) => {
  const weighted = detectWeightedIndicators(text);
  return weighted.map((w) => w.label);
};

/**
 * Returns full weighted indicator objects { id, severity, label, weight }.
 */
export const detectFullIndicators = (text) => {
  return detectWeightedIndicators(text);
};

/**
 * Calculates calibrated numeric risk score from indicators (supports either strings or weighted objects).
 */
export const calculateRiskScore = (indicators = []) => {
  if (!indicators || indicators.length === 0) return 0;
  // If array contains string labels, map them to dummy weighted objects
  const weighted = indicators.map((ind) => {
    if (typeof ind === 'object' && ind.severity) return ind;
    const str = String(ind).toLowerCase();
    if (str.includes('otp') || str.includes('password') || str.includes('arrest') || str.includes('crypto')) {
      return { severity: 'CRITICAL', weight: 50, label: String(ind) };
    }
    if (str.includes('prize') || str.includes('bank') || str.includes('brand') || str.includes('suspension')) {
      return { severity: 'HIGH', weight: 30, label: String(ind) };
    }
    return { severity: 'MEDIUM', weight: 15, label: String(ind) };
  });

  return calculateWeightedScore(weighted);
};

/**
 * Maps numeric score to risk level string.
 */
export const scoreToRiskLevel = engineScoreToRiskLevel;

/**
 * Generates recommendations.
 */
export const buildRecommendations = buildStandardRecommendations;

export { analyzeUrlHeuristics, createStandardResult };
