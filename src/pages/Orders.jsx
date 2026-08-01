import { useEffect, useState } from 'react';
import OrdersList from '../components/Orders/OrdersList';
import InlineAlert from '../components/UI/InlineAlert';
import { listOrders, updateOrderStatus } from '../services/ordersService';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await listOrders();
        if (isMounted) setOrders(data);
      } catch (err) {
        if (isMounted) setLoadError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  async function applyStatusChange(order, nextStatus, successMessage) {
    // Guarda o estado anterior para reverter caso a API recuse a mudança
    // (ex.: outra pessoa já alterou o pedido) — evita a UI "mentir" pro usuário.
    const previousOrders = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
    );

    try {
      await updateOrderStatus(order.id, nextStatus);
      setFeedback(successMessage);
    } catch (err) {
      setOrders(previousOrders);
      setLoadError(err.message);
    }
  }

  function handleAdvanceStatus(order, nextStatus) {
    applyStatusChange(order, nextStatus, `Pedido #${order.id} atualizado para "${nextStatus}".`);
  }

  function handleCancel(order) {
    applyStatusChange(order, 'cancelado', `Pedido #${order.id} cancelado.`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Pedidos</h2>
        <p className="text-sm text-slate-500">Acompanhe e avance o status dos pedidos recentes.</p>
      </div>

      {loadError && (
        <InlineAlert variant="error" message={loadError} onClose={() => setLoadError(null)} />
      )}
      {feedback && (
        <InlineAlert variant="success" message={feedback} onClose={() => setFeedback(null)} />
      )}

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Carregando pedidos...
        </div>
      ) : (
        <OrdersList orders={orders} onAdvanceStatus={handleAdvanceStatus} onCancel={handleCancel} />
      )}
    </div>
  );
}
