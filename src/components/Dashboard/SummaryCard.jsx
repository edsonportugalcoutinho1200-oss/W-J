const TONE_STYLES = {
  neutral: 'bg-white border-slate-200',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-rose-50 border-rose-200',
};

export default function SummaryCard({ icon: Icon, label, value, hint, tone = 'neutral' }) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${TONE_STYLES[tone]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/5">
            <Icon size={18} className="text-slate-700" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
