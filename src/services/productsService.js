import api from './api';
import { USE_MOCKS } from '../config/mockMode';
import {
  mockListProducts,
  mockCreateProduct,
  mockUpdateProduct,
  mockDeleteProduct,
} from '../mocks/mockProducts';

/**
 * Contrato esperado da API:
 *   GET    /products         -> Product[]
 *   POST   /products         body: ProductInput -> Product
 *   PATCH  /products/:id     body: Partial<ProductInput> -> Product
 *   DELETE /products/:id     -> 204
 *
 * Product = { id, name, sku, category, price, stock, imageUrl }
 *
 * Toda validação de negócio (SKU único, categoria existente, etc.) é
 * responsabilidade da API/banco — o frontend só valida formato (ver
 * utils/sanitize.js) antes de enviar.
 */

export async function listProducts() {
  if (USE_MOCKS) return mockListProducts();
  const { data } = await api.get('/products');
  return data;
}

export async function createProduct(payload) {
  if (USE_MOCKS) return mockCreateProduct(payload);
  const { data } = await api.post('/products', payload);
  return data;
}

export async function updateProduct(id, payload) {
  if (USE_MOCKS) return mockUpdateProduct(id, payload);
  const { data } = await api.patch(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  if (USE_MOCKS) return mockDeleteProduct(id);
  await api.delete(`/products/${id}`);
}
