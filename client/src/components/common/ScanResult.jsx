// src/components/common/ScanResult.jsx
import RiskBadge from './RiskBadge';
import RiskScore from './RiskScore';
import { getStatusConfig } from '../../utils/riskUtils';
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiAlertCircle,
  FiActivity,
} from 'react-icons/fi';

export default function ScanResult({ result, type = 'message' }) {
  if (!result) return null;

  const {
    riskLevel,
    riskScore,
    summary,
    aiAnalysis,
    explanation,
    detectedIndicators = [],
    detectedThreats = [],
    recommendations = [],
    assessmentStatus = 'completed',
    assessmentLimitations = [],
    disclaimer,
    domain,
    providerResults,
  } = result;

  const indicators =
    detectedIndicators.length > 0 ? detectedIndicators : detectedThreats;
  const analysisText = aiAnalysis || summary || explanation;
  const statusCfg = getStatusConfig(assessmentStatus);

  const hasScore =
    riskScore !== null &&
    riskScore !== undefined &&
    typeof riskScore === 'number' &&
    !isNaN(riskScore);

  return (
    <div className="animate-fade-in space-y-4 mt-6">
      {/* Header row */}
      <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <RiskScore score={riskScore} level={riskLevel} />
          <div>
            <div className="flex items-center gap-2">
              <RiskBadge level={riskLevel} size="lg" />
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  color: statusCfg.color,
                  backgroundColor: statusCfg.bg,
                  border: `1px solid ${statusCfg.color}30`,
                }}
              >
                {statusCfg.label}
              </span>
            </div>
            {domain && (
              <p className="text-slate-400 text-sm mt-1.5">
                Target Domain: <span className="text-white font-mono">{domain}</span>
              </p>
            )}
            <p className="text-slate-400 text-xs mt-1">
              Score: {hasScore ? `${Math.round(riskScore)}/100` : 'Unavailable'}
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Limitations Alert */}
      {assessmentLimitations && assessmentLimitations.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <FiAlertCircle className="text-amber-400 flex-shrink-0" size={16} />
            <h4 className="text-xs font-semibold text-amber-300">
              Assessment Scope & Limitations
            </h4>
          </div>
          <ul className="space-y-1 text-xs text-amber-200/80 pl-6 list-disc">
            {assessmentLimitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Analysis / Summary */}
      {analysisText && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiInfo className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Safety Analysis</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{analysisText}</p>
        </div>
      )}

      {/* Threat Intelligence details (for website scans) */}
      {providerResults && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiShield className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Threat Intelligence</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.entries(providerResults).map(([key, prov]) => (
              <div
                key={key}
                className="rounded-xl p-3.5"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-300">
                    {prov.provider}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      prov.available
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : 'text-slate-400 bg-slate-400/10'
                    }`}
                  >
                    {prov.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                {prov.available &&
                  (!prov.threats || prov.threats.length === 0) &&
                  (!prov.malicious || prov.malicious === 0) && (
                    <p className="text-xs text-emerald-400">No threats detected</p>
                  )}
                {prov.threats?.length > 0 && (
                  <p className="text-xs text-red-400 font-semibold">
                    {prov.threats.join(', ')}
                  </p>
                )}
                {prov.malicious > 0 && (
                  <p className="text-xs text-red-400 font-semibold">
                    {prov.malicious} engine(s) flagged this as malicious
                  </p>
                )}
                {prov.suspicious > 0 && (
                  <p className="text-xs text-amber-400">
                    {prov.suspicious} engine(s) flagged as suspicious
                  </p>
                )}
                {prov.note && (
                  <p className="text-xs text-slate-500 mt-1">{prov.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected Indicators */}
      {indicators.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiAlertTriangle className="text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Detected Indicators ({indicators.length})
            </h3>
          </div>
          <ul className="space-y-2">
            {indicators.map((ind, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                <span>{typeof ind === 'string' ? ind : ind.label || String(ind)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiCheckCircle className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <div
          className="rounded-xl p-4"
          style={{
            background: 'rgba(148,163,184,0.06)',
            border: '1px solid rgba(148,163,184,0.12)',
          }}
        >
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-400">Disclaimer: </span>
            {disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
