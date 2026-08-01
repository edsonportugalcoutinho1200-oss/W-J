const VARIANTS = {
  error: 'bg-rose-50 border-rose-200 text-rose-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  info: 'bg-slate-50 border-slate-200 text-slate-700',
};

/**
 * Exibe mensagens já normalizadas (ex.: vindas de services/api.js).
 * Nunca renderizar aqui error.stack ou objetos de erro crus.
 */
export default function InlineAlert({ variant = 'info', title, message, onClose }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${VARIANTS[variant]}`}
    >
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Fechar alerta"
          className="shrink-0 text-current/70 hover:text-current"
        >
          ✕
        </button>
      )}
    </div>
  );
}
