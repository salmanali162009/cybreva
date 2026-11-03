// src/components/common/EmptyState.jsx
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ icon: Icon = FiInbox, title = 'Nothing here', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
        <Icon className="text-emerald-400 text-2xl" />
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
      {description && <p className="text-slate-400 text-sm max-w-xs">{description}</p>}
    </div>
  );
}
