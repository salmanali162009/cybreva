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
      .select('scanType riskLevel riskScore originalInput createdAt')
      .lean(),

    // High-risk scans count
    Scan.countDocuments({ userId, riskLevel: RISK_LEVELS.HIGH }),
  ]);

  // Normalise aggregation results into flat objects
  const byType = Object.fromEntries(
    Object.values(SCAN_TYPES).map((t) => [t, 0]),
  );
  for (const { _id, count } of scansByType) {
    if (_id) byType[_id] = count;
  }

  const byRiskLevel = Object.fromEntries(
    Object.values(RISK_LEVELS).map((r) => [r, 0]),
  );
  for (const { _id, count } of scansByRiskLevel) {
    if (_id) byRiskLevel[_id] = count;
  }

  return sendSuccess(res, 200, 'Dashboard statistics retrieved.', {
    totalScans,
    highRiskCount,
    byType,
    byRiskLevel,
    recentScans,
  });
});
