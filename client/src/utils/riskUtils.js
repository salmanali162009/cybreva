// src/utils/riskUtils.js
export const RISK_CONFIG = {
  HIGH:    { label: 'High Risk',    color: '#EF4444', bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.3)',    cls: 'risk-high',    icon: '⚠' },
  MEDIUM:  { label: 'Medium Risk',  color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.3)',   cls: 'risk-medium',  icon: '⚡' },
  LOW:     { label: 'Low Risk',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',   border: 'rgba(16,185,129,0.3)',   cls: 'risk-low',     icon: '✓' },
  UNKNOWN: { label: 'Unknown Risk', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)', cls: 'risk-unknown', icon: '?' },
};

export const getRiskConfig = (level) => RISK_CONFIG[level?.toUpperCase()] || RISK_CONFIG.UNKNOWN;

export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const SCAN_TYPE_LABELS = {
  message: 'Message',
  email:   'Email',
  website: 'Website',
};
