import { mockDelay } from '../config/mockMode';

export async function mockGetDashboardSummary() {
  await mockDelay();
  return {
    revenue: 'R$ 48.320,00',
    pendingOrders: 12,
    lowStockAlerts: 4,
    totalOrders: 231,
  };
}
