import { Pencil, Trash2 } from 'lucide-react';

function StockBadge({ stock }) {
  const isLow = stock <= 5;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
      }`}
    >
      {stock} un.
    </span>
  );
}

export default function ProductsTable({ products, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Nenhum produto cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Produto</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Preço</th>
            <th className="px-4 py-3">Estoque</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="flex items-center gap-3 px-4 py-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23e2e8f0"/></svg>';
                  }}
                />
                <span className="font-medium text-slate-800">{product.name}</span>
              </td>
              <td className="px-4 py-3 text-slate-500">{product.sku}</td>
              <td className="px-4 py-3 text-slate-700">
                {Number(product.price).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
              <td className="px-4 py-3">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit?.(product)}
                    aria-label={`Editar ${product.name}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete?.(product)}
                    aria-label={`Excluir ${product.name}`}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
