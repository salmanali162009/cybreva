// src/components/common/GlassCard.jsx
import clsx from 'clsx';

export default function GlassCard({ children, className = '', hover = false, padding = true }) {
  return (
    <div
      className={clsx(
        'glass rounded-2xl',
        padding && 'p-5',
        hover && 'transition-all duration-200 hover:border-emerald-400/20',
        className,
      )}
    >
      {children}
    </div>
  );
}
