import api from './api';
import { USE_MOCKS } from '../config/mockMode';
import { mockGetDashboardSummary } from '../mocks/mockDashboardSummary';

/**
 * Contrato esperado da API:
 *   GET /dashboard/summary -> { revenue, pendingOrders, lowStockAlerts, totalOrders }
 *
 * Os agregados (soma de faturamento, contagem de pedidos pendentes, etc.)
 * devem ser calculados no backend (query/aggregation no banco), nunca
 * trazendo a lista bruta de pedidos/produtos para o frontend somar.
 */

export async function getDashboardSummary() {
  if (USE_MOCKS) return mockGetDashboardSummary();
  const { data } = await api.get('/dashboard/summary');
  return data;
}
