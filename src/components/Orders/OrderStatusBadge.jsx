const STATUS_CONFIG = {
  pendente: { label: 'Pendente', className: 'bg-amber-100 text-amber-700' },
  aprovado: { label: 'Aprovado', className: 'bg-blue-100 text-blue-700' },
  enviado: { label: 'Enviado', className: 'bg-emerald-100 text-emerald-700' },
  cancelado: { label: 'Cancelado', className: 'bg-rose-100 text-rose-700' },
};

export default function OrderStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
