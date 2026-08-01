import { mockDelay } from '../config/mockMode';

let ordersDb = [
  { id: 1042, customerName: 'Carlos Lima', total: 349.9, status: 'pendente' },
  { id: 1041, customerName: 'Fernanda Alves', total: 129.5, status: 'aprovado' },
  { id: 1040, customerName: 'Ricardo Nunes', total: 899.0, status: 'enviado' },
  { id: 1039, customerName: 'Juliana Prado', total: 59.9, status: 'pendente' },
];

export async function mockListOrders() {
  await mockDelay();
  return ordersDb;
}

export async function mockUpdateOrderStatus(id, status) {
  await mockDelay();
  ordersDb = ordersDb.map((o) => (o.id === id ? { ...o, status } : o));
  return ordersDb.find((o) => o.id === id);
}
