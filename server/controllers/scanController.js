// ─────────────────────────────────────────────
//  Cybreva — Scan controllers
// ─────────────────────────────────────────────
import Scan from '../models/Scan.js';
import { asyncHandler, sendSuccess, isValidObjectId } from '../utils/helpers.js';
import { AppError } from '../utils/AppError.js';
import { validate, messageScanSchema, emailScanSchema, websiteScanSchema } from '../validators/index.js';
import { detectTextIndicators, calculateRiskScore, scoreToRiskLevel, buildRecommendations } from '../services/scanners/textAnalyzer.js';
import { parseAndValidateUrl, normalizeUrl } from '../services/scanners/urlUtils.js';
import { analyzeWithGroq } from '../services/ai/groqService.js';
import { checkGoogleThreatIntelligence } from '../services/threat-intelligence/googleWebRisk.js';
import { checkVirusTotal } from '../services/threat-intelligence/virusTotal.js';
import { AI_DISCLAIMER, SCAN_TYPES } from '../constants/index.js';
import { getPagination } from '../utils/helpers.js';

// ── POST /api/scans/message ───────────────────
export const scanMessage = asyncHandler(async (req, res) => {
  const { message } = validate(messageScanSchema, req.body);

  const detectedIndicators = detectTextIndicators(message);
  const riskScore = calculateRiskScore(detectedIndicators);
  const riskLevel = scoreToRiskLevel(riskScore);
  const recommendations = buildRecommendations(riskLevel, detectedIndicators);

  // Get AI explanation (non-blocking; falls back gracefully)
  const aiSummary = await analyzeWithGroq(message, 'message');

  const result = {
    riskLevel,
    riskScore,
    summary: aiSummary,
    detectedIndicators,
    recommendations,
    disclaimer: AI_DISCLAIMER,
  };

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

  // Build combined text for analysis
  const combined = [
    data.subject ? `Subject: ${data.subject}` : '',
    data.sender ? `From: ${data.sender}` : '',
    `Body: ${data.body}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const detectedIndicators = detectTextIndicators(combined);

  // Additional email-specific checks
  if (data.sender) {
    const senderLower = data.sender.toLowerCase();
    // Spoofed display name (e.g. "PayPal <attacker@evil.com>")
    if (/paypal|amazon|apple|microsoft|google|facebook|netflix|bank/i.test(data.sender)) {
      detectedIndicators.push('Brand impersonation in sender address');
    }
    // Sender domain mismatch check (heuristic)
    if (senderLower.includes('@') && senderLower.split('@')[1]?.match(/\.(xyz|top|click|tk|ml|ga|cf|gq)$/)) {
      detectedIndicators.push('Suspicious sender domain (free or abused TLD)');
    }
  }

  const riskScore = calculateRiskScore(detectedIndicators);
  const riskLevel = scoreToRiskLevel(riskScore);
  const recommendations = buildRecommendations(riskLevel, detectedIndicators);

  const aiSummary = await analyzeWithGroq(combined, 'email');

  const result = {
    riskLevel,
    riskScore,
    summary: aiSummary,
    detectedIndicators,
    recommendations,
    disclaimer:
      AI_DISCLAIMER +
      ' This tool cannot verify the true origin or identity of an email sender.',
  };

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

  // Validate and normalise URL (throws on private IPs, bad schemes, etc.)
  const normalized = normalizeUrl(url);
  const parsed = parseAndValidateUrl(url);
  const domain = parsed.hostname;

  // Query external threat intelligence providers in parallel
  const [googleResult, vtResult] = await Promise.all([
    checkGoogleThreatIntelligence(normalized),
    checkVirusTotal(normalized),
  ]);

  // Compile detected threats
  const detectedThreats = [];
  if (googleResult.threats.length > 0) {
    detectedThreats.push(...googleResult.threats.map((t) => `[${googleResult.provider}] ${t}`));
  }
  if (vtResult.available && vtResult.malicious > 0) {
    detectedThreats.push(`[VirusTotal] ${vtResult.malicious} engine(s) flagged this URL as malicious`);
  }
  if (vtResult.available && vtResult.suspicious > 0) {
    detectedThreats.push(`[VirusTotal] ${vtResult.suspicious} engine(s) flagged this URL as suspicious`);
  }

  // Compute risk score
  let riskScore = 5;
  if (googleResult.threats.length > 0) riskScore = Math.max(riskScore, 90);
  if (vtResult.available) {
    const vtBad = vtResult.malicious + vtResult.suspicious;
    if (vtBad > 0) riskScore = Math.max(riskScore, Math.min(95, 40 + vtBad * 5));
  }

  // If neither service was available, mark as UNKNOWN
  const anyAvailable = googleResult.available || vtResult.available;
  const riskLevel = !anyAvailable
    ? 'UNKNOWN'
    : detectedThreats.length > 0
    ? 'HIGH'
    : riskScore >= 35
    ? 'MEDIUM'
    : 'LOW';

  const recommendations =
    riskLevel === 'HIGH'
      ? [
          'Do NOT visit this website.',
          'If you have already visited it, change any passwords you may have entered.',
          'Run a malware scan on your device.',
          'Report this URL to your browser and internet service provider.',
        ]
      : riskLevel === 'UNKNOWN'
      ? [
          'Threat intelligence services are currently unavailable.',
          'Exercise caution before visiting this site.',
          'Check the URL manually against a reputable service such as Google Safe Browsing.',
        ]
      : [
          'No known threats detected at this time.',
          'This result does not guarantee the site is completely safe.',
          'Always verify domain spelling carefully before entering personal information.',
        ];

  // AI explanation
  const aiPrompt = `URL: ${normalized}\nDomain: ${domain}\nDetected threats: ${detectedThreats.join(', ') || 'None detected'}\nRisk Level: ${riskLevel}`;
  const explanation = await analyzeWithGroq(aiPrompt, 'website');

  const providerResults = {
    google: {
      provider: googleResult.provider,
      available: googleResult.available,
      threats: googleResult.threats,
      note: googleResult.note,
    },
    virustotal: {
      provider: vtResult.provider,
      available: vtResult.available,
      malicious: vtResult.malicious,
      suspicious: vtResult.suspicious,
      harmless: vtResult.harmless,
      total: vtResult.total,
      note: vtResult.note,
    },
  };

  const result = {
    riskLevel,
    riskScore,
    domain,
    url: normalized,
    detectedThreats,
    providerResults,
    explanation,
    recommendations,
    disclaimer:
      AI_DISCLAIMER +
      ' A clean result from threat intelligence providers does not guarantee that a website is completely safe.',
  };

  let scanRecord = null;
  if (req.user) {
    scanRecord = await Scan.create({
      userId: req.user._id,
      scanType: SCAN_TYPES.WEBSITE,
      originalInput: normalized.slice(0, 2000),
      riskLevel,
      riskScore,
      summary: explanation,
      detectedIndicators: detectedThreats,
      recommendations,
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
