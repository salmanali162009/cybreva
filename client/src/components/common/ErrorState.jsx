// src/components/common/ErrorState.jsx
import { FiAlertCircle } from 'react-icons/fi';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
        <FiAlertCircle className="text-red-400 text-2xl" />
      </div>
      <h3 className="text-white font-semibold">Error</h3>
      <p className="text-slate-400 text-sm max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
          Try again
        </button>
      )}
    </div>
  );
}
