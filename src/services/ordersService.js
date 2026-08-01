import api from './api';
import { USE_MOCKS } from '../config/mockMode';
import { mockListOrders, mockUpdateOrderStatus } from '../mocks/mockOrders';

/**
 * Contrato esperado da API:
 *   GET   /orders                 -> Order[]
 *   PATCH /orders/:id/status      body: { status } -> Order
 *
 * Order = { id, customerName, total, status }
 * status ∈ 'pendente' | 'aprovado' | 'enviado' | 'cancelado'
 *
 * A transição de status válida (ex.: não permitir "enviado" -> "pendente")
 * deve ser reforçada na API — o frontend só oferece os botões coerentes
 * com o status atual (ver components/Orders/OrdersList.jsx), mas isso é
 * só UX: um cliente HTTP direto poderia tentar qualquer transição.
 */

export async function listOrders() {
  if (USE_MOCKS) return mockListOrders();
  const { data } = await api.get('/orders');
  return data;
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCKS) return mockUpdateOrderStatus(id, status);
  const { data } = await api.patch(`/orders/${id}/status`, { status });
  return data;
}
