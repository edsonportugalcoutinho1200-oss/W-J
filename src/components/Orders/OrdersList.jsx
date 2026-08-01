import OrderStatusBadge from './OrderStatusBadge';

const NEXT_ACTION = {
  pendente: { label: 'Aprovar', nextStatus: 'aprovado', className: 'bg-blue-600 hover:bg-blue-700' },
  aprovado: { label: 'Marcar como enviado', nextStatus: 'enviado', className: 'bg-emerald-600 hover:bg-emerald-700' },
  enviado: null,
  cancelado: null,
};

export default function OrdersList({ orders, onAdvanceStatus, onCancel }) {
  if (!orders.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Nenhum pedido recente.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Pedido</th>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const action = NEXT_ACTION[order.status];
            return (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">#{order.id}</td>
                <td className="px-4 py-3 text-slate-600">{order.customerName}</td>
                <td className="px-4 py-3 text-slate-700">
                  {Number(order.total).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {action && (
                      <button
                        onClick={() => onAdvanceStatus?.(order, action.nextStatus)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white ${action.className}`}
                      >
                        {action.label}
                      </button>
                    )}
                    {order.status !== 'cancelado' && order.status !== 'enviado' && (
                      <button
                        onClick={() => onCancel?.(order)}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
