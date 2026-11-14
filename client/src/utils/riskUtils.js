// src/utils/riskUtils.js

export const RISK_CONFIG = {
  CRITICAL: {
    label: 'Critical Risk',
    color: '#EF4444',
    bg: 'rgba(220,38,38,0.18)',
    border: 'rgba(220,38,38,0.45)',
    cls: 'risk-critical',
    icon: '🚨',
    range: '75–100',
  },
  HIGH: {
    label: 'High Risk',
    color: '#F87171',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    cls: 'risk-high',
    icon: '⚠',
    range: '50–74',
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)',
    cls: 'risk-medium',
    icon: '⚡',
    range: '25–49',
  },
  LOW: {
    label: 'Low Risk',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.3)',
    cls: 'risk-low',
    icon: '✓',
    range: '0–24',
  },
  UNKNOWN: {
    label: 'Assessment Unavailable',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.12)',
    border: 'rgba(148,163,184,0.3)',
    cls: 'risk-unknown',
    icon: '?',
    range: 'N/A',
  },
};

/**
 * Returns the risk configuration object for any risk level string.
 * Supports lowercase, uppercase, or undefined.
 */
export const getRiskConfig = (level) => {
  if (!level) return RISK_CONFIG.UNKNOWN;
  const key = String(level).toUpperCase();
  return RISK_CONFIG[key] || RISK_CONFIG.UNKNOWN;
};

export const STATUS_CONFIG = {
  completed: { label: 'Completed', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  partial:   { label: 'Partial Assessment', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  failed:    { label: 'Assessment Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.completed;
};

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const SCAN_TYPE_LABELS = {
  message: 'Message',
  email: 'Email',
  website: 'Website',
};
