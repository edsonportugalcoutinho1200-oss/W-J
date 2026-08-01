import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import ProductsTable from '../components/Products/ProductsTable';
import ProductForm from '../components/Products/ProductForm';
import InlineAlert from '../components/UI/InlineAlert';
import { listProducts, createProduct, deleteProduct } from '../services/productsService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setLoadError(null);
        const data = await listProducts();
        if (isMounted) setProducts(data);
      } catch (err) {
        if (isMounted) setLoadError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleCreateProduct(payload) {
    // Erros daqui sobem para o próprio ProductForm (que já trata o
    // try/catch e exibe a mensagem no formulário).
    const created = await createProduct(payload);
    setProducts((prev) => [...prev, created]);
    setFeedback('Produto cadastrado com sucesso.');
    setShowForm(false);
  }

  async function handleDelete(product) {
    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setFeedback(`Produto "${product.name}" removido.`);
    } catch (err) {
      setLoadError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Produtos</h2>
          <p className="text-sm text-slate-500">Gerencie o catálogo da loja.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Plus size={16} />
          {showForm ? 'Fechar formulário' : 'Novo produto'}
        </button>
      </div>

      {loadError && (
        <InlineAlert variant="error" message={loadError} onClose={() => setLoadError(null)} />
      )}
      {feedback && (
        <InlineAlert variant="success" message={feedback} onClose={() => setFeedback(null)} />
      )}

      {showForm && (
        <ProductForm onSubmit={handleCreateProduct} onCancel={() => setShowForm(false)} />
      )}

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Carregando produtos...
        </div>
      ) : (
        <ProductsTable products={products} onDelete={handleDelete} onEdit={() => {}} />
      )}
    </div>
  );
}
