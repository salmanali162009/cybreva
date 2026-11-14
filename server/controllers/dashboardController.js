// ─────────────────────────────────────────────
//  Cybreva — Dashboard controller
// ─────────────────────────────────────────────
import Scan from '../models/Scan.js';
import { asyncHandler, sendSuccess } from '../utils/helpers.js';
import { RISK_LEVELS, SCAN_TYPES } from '../constants/index.js';

// ── GET /api/dashboard/stats ──────────────────
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [
    totalScans,
    scansByType,
    scansByRiskLevel,
    recentScans,
    highRiskCount,
    criticalRiskCount,
  ] = await Promise.all([
    // Total scans
    Scan.countDocuments({ userId }),

    // Scans grouped by type
    Scan.aggregate([
      { $match: { userId } },
      { $group: { _id: '$scanType', count: { $sum: 1 } } },
    ]),

    // Scans grouped by risk level
    Scan.aggregate([
      { $match: { userId } },
      { $group: { _id: '$riskLevel', count: { $sum: 1 } } },
    ]),

    // 5 most recent scans
    Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('scanType riskLevel riskScore originalInput createdAt assessmentStatus')
      .lean(),

    // High + Critical scans count
    Scan.countDocuments({
      userId,
      riskLevel: { $in: ['high', 'critical', 'HIGH', 'CRITICAL'] },
    }),

    // Critical scans count specifically
    Scan.countDocuments({
      userId,
      riskLevel: { $in: ['critical', 'CRITICAL'] },
    }),
  ]);

  // Normalise aggregation results into flat objects
  const byType = Object.fromEntries(
    Object.values(SCAN_TYPES).map((t) => [t, 0]),
  );
  for (const { _id, count } of scansByType) {
    if (_id) byType[_id.toLowerCase()] = count;
  }

  // Normalise risk levels to lowercase and provide uppercase aliases
  const byRiskLevel = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
    unknown: 0,
  };
  for (const { _id, count } of scansByRiskLevel) {
    if (_id) {
      const key = String(_id).toLowerCase();
      if (byRiskLevel[key] !== undefined) {
        byRiskLevel[key] += count;
      } else {
        byRiskLevel[key] = count;
      }
    }
  }

  // Backwards compatibility aliases
  byRiskLevel.LOW = byRiskLevel.low;
  byRiskLevel.MEDIUM = byRiskLevel.medium;
  byRiskLevel.HIGH = byRiskLevel.high;
  byRiskLevel.CRITICAL = byRiskLevel.critical;
  byRiskLevel.UNKNOWN = byRiskLevel.unknown;

  return sendSuccess(res, 200, 'Dashboard statistics retrieved.', {
    totalScans,
    highRiskCount,
    criticalRiskCount,
    byType,
    byRiskLevel,
    recentScans,
  });
});
