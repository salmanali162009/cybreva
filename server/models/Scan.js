// ─────────────────────────────────────────────
//  Cybreva — Scan model
// ─────────────────────────────────────────────
import mongoose from 'mongoose';
import { RISK_LEVELS, SCAN_TYPES } from '../constants/index.js';

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scanType: {
      type: String,
      enum: Object.values(SCAN_TYPES),
      required: true,
    },
    // Store only the first 2000 chars of the original input to avoid bloat
    originalInput: {
      type: String,
      maxlength: 2000,
    },
    riskLevel: {
      type: String,
      enum: [
        'low', 'medium', 'high', 'critical', 'unknown',
        'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'UNKNOWN',
      ],
      required: true,
      set: (v) => (typeof v === 'string' ? v.toLowerCase() : v),
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    assessmentStatus: {
      type: String,
      enum: ['completed', 'partial', 'failed'],
      default: 'completed',
    },
    assessmentLimitations: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      maxlength: 3000,
    },
    aiAnalysis: {
      type: String,
      maxlength: 3000,
    },
    detectedIndicators: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    // Raw results from external providers (Google Web Risk, VirusTotal, etc.)
    providerResults: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    disclaimer: {
      type: String,
    },
  },
  { timestamps: true },
);

// Compound index for efficient per-user history queries
scanSchema.index({ userId: 1, createdAt: -1 });

const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
