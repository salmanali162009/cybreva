// src/components/common/RiskBadge.jsx
import { getRiskConfig } from '../../utils/riskUtils';

export default function RiskBadge({ level, size = 'md' }) {
  const cfg = getRiskConfig(level);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${cfg.cls}`}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
