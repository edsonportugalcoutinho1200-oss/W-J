import { useState, useEffect } from 'react';
import { listProducts } from '../services/productsService';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await listProducts();
        setProducts(data);
      } catch (err) {
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>Nenhum produto encontrado.</p>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;