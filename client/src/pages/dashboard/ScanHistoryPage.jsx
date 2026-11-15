// src/pages/dashboard/ScanHistoryPage.jsx
import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import RiskBadge from '../../components/common/RiskBadge';
import LoadingState from '../../components/common/LoadingState';
import EmptyState from '../../components/common/EmptyState';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { scanApi } from '../../services/api';
import { FiClock, FiTrash2, FiMessageSquare, FiMail, FiGlobe, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatDate, SCAN_TYPE_LABELS } from '../../utils/riskUtils';
import toast from 'react-hot-toast';

const SCAN_ICONS = { message: FiMessageSquare, email: FiMail, website: FiGlobe };
const TYPES = ['', 'message', 'email', 'website'];

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [scanToDelete, setScanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await scanApi.getHistory({ page, limit: 10, ...(type ? { type } : {}) });
      setScans(res.data.data.scans);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to load history');
    } finally { setLoading(false); }
  }, [page, type]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleOpenDeleteModal = (scan) => {
    setScanToDelete(scan);
  };

  const handleCancelDelete = () => {
    if (isDeleting) return;
    setScanToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!scanToDelete || isDeleting) return;
    try {
      setIsDeleting(true);
      await scanApi.deleteScan(scanToDelete._id);
      toast.success('Scan deleted');
      setScans((s) => s.filter((scan) => scan._id !== scanToDelete._id));
      setPagination((p) => ({ ...p, total: Math.max(0, p.total - 1) }));
      setScanToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Scan History</h1>
            <p className="text-slate-400 text-sm">{pagination.total} total scan{pagination.total !== 1 ? 's' : ''}</p>
          </div>
          {/* Type filter */}
          <div className="flex gap-1.5">
            {TYPES.map((t) => (
              <button key={t} onClick={() => { setType(t); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${type === t ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                style={type === t ? { background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.15))', border: '1px solid rgba(16,185,129,0.25)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {t ? SCAN_TYPE_LABELS[t] : 'All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingState text="Loading history…" />
        ) : scans.length === 0 ? (
          <EmptyState icon={FiClock} title="No scans yet" description="Your scan history will appear here after you run your first scan." />
        ) : (
          <div className="space-y-2">
            {scans.map((scan) => {
              const Icon = SCAN_ICONS[scan.scanType] || FiClock;
              return (
                <div key={scan._id} className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-white/10 transition-all">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Icon className="text-slate-400" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-sm font-medium capitalize">{scan.scanType} Scan</span>
                    </div>
                    <p className="text-slate-500 text-xs truncate">{scan.originalInput?.slice(0, 80) || '—'}</p>
                    <p className="text-slate-600 text-xs mt-0.5">{formatDate(scan.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {scan.riskScore !== null && scan.riskScore !== undefined && (
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                        {Math.round(scan.riskScore)}/100
                      </span>
                    )}
                    <RiskBadge level={scan.riskLevel} size="sm" />
                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(scan)}
                      className="text-slate-600 hover:text-red-400 transition-colors p-1"
                      title="Delete scan"
                      aria-label={`Delete ${scan.scanType} scan`}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white disabled:opacity-40 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <FiChevronLeft size={15} /> Previous
            </button>
            <span className="text-slate-500 text-sm">Page {page} of {pagination.totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white disabled:opacity-40 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              Next <FiChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!scanToDelete}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Scan History?"
          description="Are you sure you want to delete this scan record? This action cannot be undone."
          itemDetails={
            scanToDelete
              ? {
                  type: `${scanToDelete.scanType} scan`,
                  date: formatDate(scanToDelete.createdAt),
                  preview: scanToDelete.originalInput?.slice(0, 80) || '—',
                }
              : null
          }
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
