// src/components/common/LoadingState.jsx
export default function LoadingState({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}
