import { mockDelay } from '../config/mockMode';

// "Banco" em memória — reseta a cada refresh da página, propositalmente
// (é só para navegação/demonstração, não para persistir dados de verdade).
let productsDb = [
  {
    id: 1,
    name: 'Fone de Ouvido Bluetooth',
    sku: 'FONE-BT-001',
    category: 'Eletrônicos',
    price: 199.9,
    stock: 32,
    imageUrl: 'https://picsum.photos/seed/fone/80',
  },
  {
    id: 2,
    name: 'Mochila Executiva',
    sku: 'MOCH-EXE-014',
    category: 'Moda',
    price: 249.0,
    stock: 4,
    imageUrl: 'https://picsum.photos/seed/mochila/80',
  },
  {
    id: 3,
    name: 'Garrafa Térmica 1L',
    sku: 'GARR-TER-002',
    category: 'Casa',
    price: 79.9,
    stock: 58,
    imageUrl: 'https://picsum.photos/seed/garrafa/80',
  },
];

export async function mockListProducts() {
  await mockDelay();
  return productsDb;
}

export async function mockCreateProduct(payload) {
  await mockDelay();
  const created = { id: Date.now(), imageUrl: 'https://picsum.photos/seed/novo/80', ...payload };
  productsDb = [...productsDb, created];
  return created;
}

export async function mockUpdateProduct(id, payload) {
  await mockDelay();
  productsDb = productsDb.map((p) => (p.id === id ? { ...p, ...payload } : p));
  return productsDb.find((p) => p.id === id);
}

export async function mockDeleteProduct(id) {
  await mockDelay();
  productsDb = productsDb.filter((p) => p.id !== id);
}
