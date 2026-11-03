// src/components/common/RiskScore.jsx
import { getRiskConfig } from '../../utils/riskUtils';

export default function RiskScore({ score, level }) {
  const cfg = getRiskConfig(level);
  const pct = Math.min(100, Math.max(0, score || 0));
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="rotate-[-90deg]" width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={cfg.color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color: cfg.color }}>{pct}</span>
        </div>
      </div>
      <span className="text-xs text-slate-400">Risk Score</span>
    </div>
  );
}
