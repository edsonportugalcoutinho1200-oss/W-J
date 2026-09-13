import api from './api';

/**
 * Contrato da API (mesmo usado no backoffice-ecommerce):
 *   GET /products -> Product[]
 *
 * Product = { id, name, sku, category, price, stock, imageUrl }
 *
 * Por enquanto, a loja só precisa LISTAR produtos (sem criar,
 * editar ou deletar — isso é função do backoffice).
 */
export async function listProducts() {
  const { data } = await api.get('/products');
  return data;
}