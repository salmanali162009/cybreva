// src/components/common/DeleteConfirmModal.jsx
import { useEffect } from 'react';
import { FiAlertTriangle, FiTrash2, FiX } from 'react-icons/fi';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Scan History?',
  description = 'Are you sure you want to delete this scan record? This action cannot be undone.',
  itemDetails = null,
  isDeleting = false,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 glass-2 shadow-2xl border border-white/10 z-10 animate-fade-in"
        style={{
          background: 'rgba(17, 28, 46, 0.95)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.08)',
        }}
      >
        {/* Close icon button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-40"
          aria-label="Close dialog"
        >
          <FiX size={18} />
        </button>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
          {/* Warning Icon Badge */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#EF4444',
            }}
          >
            <FiAlertTriangle size={24} />
          </div>

          <div className="space-y-1.5 w-full">
            <h3 id="delete-modal-title" className="text-lg font-bold text-white">
              {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {description}
            </p>

            {itemDetails && (
              <div
                className="mt-3 p-3 rounded-xl text-xs font-mono text-slate-300 break-all text-left"
                style={{
                  background: 'rgba(11, 18, 32, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center gap-2 mb-1 text-[11px] font-sans font-medium text-slate-400">
                  <span className="capitalize">{itemDetails.type || 'Scan'}</span>
                  {itemDetails.date && (
                    <>
                      <span>•</span>
                      <span>{itemDetails.date}</span>
                    </>
                  )}
                </div>
                <div className="truncate text-slate-300">
                  {itemDetails.preview || '—'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all disabled:opacity-40"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-950/40"
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            }}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FiTrash2 size={15} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
