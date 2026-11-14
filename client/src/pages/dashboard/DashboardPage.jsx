// src/pages/dashboard/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../services/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { FiMessageSquare, FiMail, FiGlobe, FiCpu, FiAlertTriangle, FiShield, FiClock } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDate, SCAN_TYPE_LABELS } from '../../utils/riskUtils';

const RISK_DISPLAY = {
  critical: { label: 'Critical Risk', color: '#DC2626' },
  high:     { label: 'High Risk',     color: '#EF4444' },
  medium:   { label: 'Medium Risk',   color: '#F59E0B' },
  low:      { label: 'Low Risk',      color: '#10B981' },
  unknown:  { label: 'Unavailable',   color: '#94A3B8' },
};

const STAT_ICONS = { message: FiMessageSquare, email: FiMail, website: FiGlobe };

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true); setError(null);
      const res = await dashboardApi.getStats();
      setStats(res.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const pieData = stats
    ? ['critical', 'high', 'medium', 'low', 'unknown']
        .map((k) => {
          const count = stats.byRiskLevel[k] !== undefined
            ? stats.byRiskLevel[k]
            : (stats.byRiskLevel[k.toUpperCase()] || 0);
          return {
            name: RISK_DISPLAY[k].label,
            value: count,
            color: RISK_DISPLAY[k].color,
          };
        })
        .filter((d) => d.value > 0)
    : [];

  const typeData = stats
    ? Object.entries(stats.byType).map(([k, v]) => ({
        key: k, label: SCAN_TYPE_LABELS[k] || k, value: v,
        Icon: STAT_ICONS[k] || FiShield,
      }))
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your security overview</p>
        </div>

        {loading && <LoadingState text="Loading dashboard..." />}
        {error && <ErrorState message={error} onRetry={fetchStats} />}

        {stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard>
                <p className="text-slate-400 text-xs mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-white">{stats.totalScans}</p>
              </GlassCard>
              <GlassCard>
                <p className="text-slate-400 text-xs mb-1">Threats Detected</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-red-400">{stats.highRiskCount}</p>
                  {stats.criticalRiskCount > 0 && (
                    <span className="text-xs text-red-300 font-semibold">({stats.criticalRiskCount} critical)</span>
                  )}
                </div>
              </GlassCard>
              <GlassCard>
                <p className="text-slate-400 text-xs mb-1">Medium Risk</p>
                <p className="text-3xl font-bold text-amber-400">
                  {stats.byRiskLevel.medium ?? stats.byRiskLevel.MEDIUM ?? 0}
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-slate-400 text-xs mb-1">Low Risk</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {stats.byRiskLevel.low ?? stats.byRiskLevel.LOW ?? 0}
                </p>
              </GlassCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {/* Pie chart */}
              <GlassCard>
                <h2 className="text-white font-semibold mb-4">Risk Distribution</h2>
                {pieData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                    No scans yet — start scanning to see data.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        dataKey="value" paddingAngle={3}>
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#111C2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#F8FAFC', fontSize: 13 }}
                      />
                      <Legend formatter={(v) => <span style={{ color: '#94A3B8', fontSize: 12 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>

              {/* Scan types */}
              <GlassCard>
                <h2 className="text-white font-semibold mb-4">Scans by Type</h2>
                <div className="space-y-3">
                  {typeData.map(({ key, label, value, Icon }) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(16,185,129,0.1)' }}>
                        <Icon className="text-emerald-400" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300 text-sm">{label}</span>
                          <span className="text-white text-sm font-medium">{value}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${stats.totalScans ? (value / stats.totalScans) * 100 : 0}%`, background: 'linear-gradient(90deg,#10B981,#06B6D4)' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Quick actions */}
            <GlassCard>
              <h2 className="text-white font-semibold mb-4">Quick Scan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { to: '/dashboard/message', icon: FiMessageSquare, label: 'Check Message', color: '#10B981' },
                  { to: '/dashboard/email', icon: FiMail, label: 'Analyze Email', color: '#06B6D4' },
                  { to: '/dashboard/website', icon: FiGlobe, label: 'Check Website', color: '#8B5CF6' },
                  { to: '/dashboard/ai', icon: FiCpu, label: 'AI Assistant', color: '#F59E0B' },
                ].map(({ to, icon: Icon, label, color }) => (
                  <Link key={to} to={to}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:border-white/10 text-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${color}15` }}>
                      <Icon style={{ color }} size={18} />
                    </div>
                    <span className="text-slate-300 text-xs font-medium">{label}</span>
                  </Link>
                ))}
              </div>
            </GlassCard>

            {/* Recent scans */}
            {stats.recentScans.length > 0 && (
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-semibold">Recent Scans</h2>
                  <Link to="/dashboard/history" className="text-emerald-400 text-xs hover:text-emerald-300 transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="space-y-2">
                  {stats.recentScans.map((scan) => (
                    <div key={scan._id} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {scan.scanType === 'message' && <FiMessageSquare className="text-slate-400" size={14} />}
                        {scan.scanType === 'email' && <FiMail className="text-slate-400" size={14} />}
                        {scan.scanType === 'website' && <FiGlobe className="text-slate-400" size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium capitalize">{scan.scanType} Scan</p>
                        <p className="text-slate-500 text-xs truncate">
                          {scan.originalInput?.slice(0, 60) || '—'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <RiskBadge level={scan.riskLevel} size="sm" />
                        <span className="text-slate-600 text-xs">{formatDate(scan.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
