// ─────────────────────────────────────────────
//  Cybreva — Scan controllers
// ─────────────────────────────────────────────
import Scan from '../models/Scan.js';
import { asyncHandler, sendSuccess, isValidObjectId } from '../utils/helpers.js';
import { AppError } from '../utils/AppError.js';
import { validate, messageScanSchema, emailScanSchema, websiteScanSchema } from '../validators/index.js';
import {
  detectWeightedIndicators,
  calculateWeightedScore,
  scoreToRiskLevel,
  analyzeUrlHeuristics,
  buildStandardRecommendations,
  createStandardResult,
  synthesizeScanAssessment,
  INDICATOR_WEIGHTS,
} from '../services/scanners/riskEngine.js';
import { parseAndValidateUrl, normalizeUrl } from '../services/scanners/urlUtils.js';
import { analyzeWithGroq } from '../services/ai/groqService.js';
import { checkGoogleThreatIntelligence } from '../services/threat-intelligence/googleWebRisk.js';
import { checkVirusTotal } from '../services/threat-intelligence/virusTotal.js';
import { AI_DISCLAIMER, SCAN_TYPES, RISK_LEVELS } from '../constants/index.js';
import { getPagination } from '../utils/helpers.js';

// Helper to extract URLs from text
const extractUrlsFromText = (text) => {
  const urlRegex = /https?:\/\/[^\s<>"'{}|\\^`[\]]+/gi;
  return text.match(urlRegex) || [];
};

// ── POST /api/scans/message ───────────────────
export const scanMessage = asyncHandler(async (req, res) => {
  const { message } = validate(messageScanSchema, req.body);

  // 1. Text indicators
  const indicators = detectWeightedIndicators(message);

  // 2. Extract and check any embedded URLs
  const embeddedUrls = extractUrlsFromText(message);
  for (const rawUrl of embeddedUrls.slice(0, 5)) {
    const urlIndicators = analyzeUrlHeuristics(rawUrl);
    for (const uInd of urlIndicators) {
      if (!indicators.some((i) => i.id === uInd.id)) {
        indicators.push(uInd);
      }
    }
  }

  // 3. Compute heuristic baseline
  const heuristicScore = calculateWeightedScore(indicators);
  const heuristicLevel = scoreToRiskLevel(heuristicScore);
  const detectedLabels = indicators.map((i) => i.label);

  // 4. AI explanation & deep threat analysis
  const aiResult = await analyzeWithGroq(message, 'message', {
    detectedIndicators: detectedLabels,
    riskLevel: heuristicLevel,
    riskScore: heuristicScore,
  });

  // 5. Synthesize indicators and dual score consistently
  const result = synthesizeScanAssessment({
    heuristicIndicators: indicators,
    aiResult,
    scanType: SCAN_TYPES.MESSAGE,
    disclaimer: AI_DISCLAIMER,
  });

  // Persist scan for authenticated users
  let scanRecord = null;
  if (req.user) {
    scanRecord = await Scan.create({
      userId: req.user._id,
      scanType: SCAN_TYPES.MESSAGE,
      originalInput: message.slice(0, 2000),
      ...result,
    });
  }

  return sendSuccess(res, 200, 'Message scan completed.', {
    ...result,
    scanId: scanRecord?._id || null,
  });
});

// ── POST /api/scans/email ─────────────────────
export const scanEmail = asyncHandler(async (req, res) => {
  const data = validate(emailScanSchema, req.body);

  const combined = [
    data.subject ? `Subject: ${data.subject}` : '',
    data.sender ? `From: ${data.sender}` : '',
    `Body: ${data.body}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  // 1. Detect indicators across subject and body
  const indicators = detectWeightedIndicators(combined);

  // 2. Additional sender-specific checks
  if (data.sender) {
    const sender = data.sender.toLowerCase();
    // Brand impersonation in sender
    if (/(?:paypal|amazon|apple|microsoft|google|facebook|netflix|chase|bank)/i.test(data.sender)) {
      if (!indicators.some((i) => i.id === 'SENDER_BRAND_IMPERSONATION')) {
        indicators.push({
          id: 'SENDER_BRAND_IMPERSONATION',
          severity: 'HIGH',
          label: 'Brand impersonation in sender display name or address',
          weight: INDICATOR_WEIGHTS.HIGH,
        });
      }
    }
    // Abused or high-risk TLD in sender domain
    if (sender.includes('@')) {
      const domainPart = sender.split('@')[1] || '';
      if (domainPart.match(/\.(xyz|top|click|tk|ml|ga|cf|gq|buzz|fit|work|rest)$/)) {
        if (!indicators.some((i) => i.id === 'SENDER_SUSPICIOUS_TLD')) {
          indicators.push({
            id: 'SENDER_SUSPICIOUS_TLD',
            severity: 'HIGH',
            label: 'Suspicious sender domain (free or abused top-level domain)',
            weight: INDICATOR_WEIGHTS.HIGH,
          });
        }
      }
    }
  }

  // 3. Extract and check any embedded links in the email body
  const embeddedUrls = extractUrlsFromText(data.body);
  for (const rawUrl of embeddedUrls.slice(0, 5)) {
    const urlIndicators = analyzeUrlHeuristics(rawUrl);
    for (const uInd of urlIndicators) {
      if (!indicators.some((i) => i.id === uInd.id)) {
        indicators.push(uInd);
      }
    }
  }

  // 4. Compute heuristic baseline
  const heuristicScore = calculateWeightedScore(indicators);
  const heuristicLevel = scoreToRiskLevel(heuristicScore);
  const detectedLabels = indicators.map((i) => i.label);

  // 5. AI explanation & deep threat analysis
  const aiResult = await analyzeWithGroq(combined, 'email', {
    detectedIndicators: detectedLabels,
    riskLevel: heuristicLevel,
    riskScore: heuristicScore,
  });

  const emailLimitations = [
    'Email sender headers (SPF, DKIM, DMARC) cannot be cryptographically verified without raw RFC822 MIME headers.',
  ];

  // 6. Synthesize indicators and dual score consistently
  const result = synthesizeScanAssessment({
    heuristicIndicators: indicators,
    aiResult,
    scanType: SCAN_TYPES.EMAIL,
    disclaimer:
      AI_DISCLAIMER +
      ' This tool cannot verify the cryptographic authenticity of an email sender.',
    fallbackLimitations: emailLimitations,
  });

  let scanRecord = null;
  if (req.user) {
    scanRecord = await Scan.create({
      userId: req.user._id,
      scanType: SCAN_TYPES.EMAIL,
      originalInput: combined.slice(0, 2000),
      ...result,
    });
  }

  return sendSuccess(res, 200, 'Email scan completed.', {
    ...result,
    scanId: scanRecord?._id || null,
  });
});

// ── POST /api/scans/website ───────────────────
export const scanWebsite = asyncHandler(async (req, res) => {
  const { url } = validate(websiteScanSchema, req.body);

  // 1. Validate and normalise URL (SSRF and IP filtering)
  const normalized = normalizeUrl(url);
  const parsed = parseAndValidateUrl(url);
  const domain = parsed.hostname;

  // 2. Run heuristic threat analysis on domain and path
  const heuristicIndicators = analyzeUrlHeuristics(normalized);

  // 3. Query external threat intelligence providers in parallel
  const [googleResult, vtResult] = await Promise.all([
    checkGoogleThreatIntelligence(normalized),
    checkVirusTotal(normalized),
  ]);

  // Compile detected threats from threat intelligence
  const detectedThreats = [];
  if (googleResult.threats?.length > 0) {
    detectedThreats.push(...googleResult.threats.map((t) => `[${googleResult.provider}] ${t}`));
  }
  if (vtResult.available && vtResult.malicious > 0) {
    detectedThreats.push(`[VirusTotal] ${vtResult.malicious} security vendor(s) flagged this URL as malicious`);
  }
  if (vtResult.available && vtResult.suspicious > 0) {
    detectedThreats.push(`[VirusTotal] ${vtResult.suspicious} security vendor(s) flagged this URL as suspicious`);
  }

  // Combine heuristic indicator labels with threat intelligence detections
  const allIndicators = [
    ...detectedThreats,
    ...heuristicIndicators.map((h) => h.label),
  ];

  // 4. Distinguish four concrete assessment states:
  // State 1: Confirmed Threat Intelligence Match
  // State 2: Suspicious Heuristic Indicators
  // State 3: Clean (Threat intel queried with no match, heuristics clean)
  // State 4: Unable to Assess (Threat intel unavailable, heuristics clean/ambiguous)

  const threatIntelAvailable = googleResult.available || vtResult.available;
  let riskScore = 0;
  let riskLevel = RISK_LEVELS.LOW;
  let assessmentStatus = 'completed';
  const assessmentLimitations = [];

  if (detectedThreats.length > 0) {
    // State 1: Confirmed Threat Intel Match
    const vtBad = (vtResult.malicious || 0) + (vtResult.suspicious || 0);
    riskScore = Math.min(98, Math.max(90, 85 + vtBad * 2));
    riskLevel = RISK_LEVELS.CRITICAL;
    assessmentStatus = 'completed';
  } else if (heuristicIndicators.length > 0) {
    // State 2: Suspicious Heuristics
    riskScore = calculateWeightedScore(heuristicIndicators);
    riskLevel = scoreToRiskLevel(riskScore);
    assessmentStatus = threatIntelAvailable ? 'completed' : 'partial';
    if (!threatIntelAvailable) {
      assessmentLimitations.push(
        'External threat intelligence databases were unavailable; assessment is based on local URL heuristic analysis.',
      );
    }
  } else if (threatIntelAvailable) {
    // State 3: No Known Threat Found
    riskScore = 10;
    riskLevel = RISK_LEVELS.LOW;
    assessmentStatus = 'completed';
    assessmentLimitations.push(
      'No active threat records found in Google Safe Browsing or VirusTotal. Note that brand-new or targeted phishing URLs may not yet appear in public threat databases.',
    );
  } else {
    // State 4: Unable to assess
    riskScore = null;
    riskLevel = RISK_LEVELS.UNKNOWN;
    assessmentStatus = 'partial';
    assessmentLimitations.push(
      'Threat intelligence services (Google Safe Browsing / VirusTotal) are currently unavailable or unconfigured.',
      'Assessment is limited to URL syntax validation; safe browsing status cannot be determined.',
    );
  }

  // 5. AI explanation
  const aiPrompt =
    `URL: ${normalized}\n` +
    `Domain: ${domain}\n` +
    `Detected threats / indicators: ${allIndicators.join(', ') || 'None detected'}\n` +
    `Assessment State: ${riskLevel} (Score: ${riskScore ?? 'N/A'})\n` +
    `Threat Intel: Google (${googleResult.available ? 'Available' : 'Unavailable'}), VirusTotal (${vtResult.available ? 'Available' : 'Unavailable'})`;

  const aiResult = await analyzeWithGroq(aiPrompt, 'website', {
    detectedIndicators: allIndicators,
    riskLevel,
    riskScore,
  });

  const aiAnalysis = aiResult.structured?.explanation || aiResult.text || String(aiResult);
  if (!aiResult.available) {
    assessmentLimitations.push('AI summary service was temporarily unavailable.');
  }

  const recommendations =
    aiResult.structured?.recommendations && Array.isArray(aiResult.structured.recommendations) && aiResult.structured.recommendations.length > 0
      ? aiResult.structured.recommendations
      : [];

  const providerResults = {
    google: {
      provider: googleResult.provider,
      available: googleResult.available,
      threats: googleResult.threats || [],
      note: googleResult.note,
    },
    virustotal: {
      provider: vtResult.provider,
      available: vtResult.available,
      malicious: vtResult.malicious || 0,
      suspicious: vtResult.suspicious || 0,
      harmless: vtResult.harmless || 0,
      total: vtResult.total || 0,
      note: vtResult.note,
    },
  };

  const result = createStandardResult({
    riskScore,
    riskLevel,
    detectedIndicators: allIndicators,
    aiAnalysis,
    recommendations,
    assessmentStatus,
    assessmentLimitations,
    disclaimer:
      AI_DISCLAIMER +
      ' A clean result from threat intelligence providers does not guarantee that a website is completely safe.',
    metadata: {
      domain,
      url: normalized,
      detectedThreats,
      providerResults,
    },
  });

  let scanRecord = null;
  if (req.user) {
    scanRecord = await Scan.create({
      userId: req.user._id,
      scanType: SCAN_TYPES.WEBSITE,
      originalInput: normalized.slice(0, 2000),
      riskLevel: result.riskLevel,
      riskScore: result.riskScore,
      summary: result.aiAnalysis,
      aiAnalysis: result.aiAnalysis,
      detectedIndicators: result.detectedIndicators,
      recommendations: result.recommendations,
      assessmentStatus: result.assessmentStatus,
      assessmentLimitations: result.assessmentLimitations,
      providerResults,
      disclaimer: result.disclaimer,
    });
  }

  return sendSuccess(res, 200, 'Website scan completed.', {
    ...result,
    scanId: scanRecord?._id || null,
  });
});

// ── GET /api/scans/history ────────────────────
export const getScanHistory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { type } = req.query;

  const filter = { userId: req.user._id };
  if (type && Object.values(SCAN_TYPES).includes(type)) {
    filter.scanType = type;
  }

  const [scans, total] = await Promise.all([
    Scan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Scan.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Scan history retrieved.', {
    scans,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// ── GET /api/scans/:id ────────────────────────
export const getScanById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError('Invalid scan ID format.', 400);
  }

  const scan = await Scan.findOne({ _id: req.params.id, userId: req.user._id }).lean();
  if (!scan) throw new AppError('Scan not found.', 404);

  return sendSuccess(res, 200, 'Scan retrieved.', { scan });
});

// ── DELETE /api/scans/:id ─────────────────────
export const deleteScan = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError('Invalid scan ID format.', 400);
  }

  const scan = await Scan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!scan) throw new AppError('Scan not found.', 404);

  return sendSuccess(res, 200, 'Scan deleted successfully.');
});
