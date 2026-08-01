import { useState } from 'react';
import { Clock, Megaphone, Check } from 'lucide-react';

// A partir de quantos dias sem venda um produto é considerado "encalhado".
const STAGNANT_DAYS_THRESHOLD = 30;

function daysSince(dateIso) {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function StagnantProducts({ products, onCreatePromotion }) {
  // Controla localmente quais itens já tiveram a promoção "criada" nesta
  // sessão, só para dar feedback visual imediato no botão.
  const [promotedIds, setPromotedIds] = useState(() => new Set());

  const stagnantProducts = products
    .map((product) => ({ ...product, daysSinceLastSale: daysSince(product.lastSaleAt) }))
    .filter((product) => product.daysSinceLastSale >= STAGNANT_DAYS_THRESHOLD)
    .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale);

  function handleCreatePromotion(product) {
    // Ação simulada: ainda não existe endpoint de promoções na API.
    // TODO: substituir por uma chamada real, ex.:
    //   await api.post('/marketing/promotions', { productId: product.id })
    setPromotedIds((prev) => new Set(prev).add(product.id));
    onCreatePromotion?.(product);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
          <Clock className="text-slate-500" size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800">Produtos encalhados</h3>
          <p className="text-xs text-slate-500">
            Sem vendas há {STAGNANT_DAYS_THRESHOLD}+ dias
          </p>
        </div>
      </div>

      {stagnantProducts.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Nenhum produto parado no momento.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {stagnantProducts.map((product) => {
            const wasPromoted = promotedIds.has(product.id);
            return (
              <li key={product.id} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-700">{product.name}</p>
                  <p className="text-xs text-slate-400">
                    {product.daysSinceLastSale} dias sem vender
                  </p>
                </div>
                <button
                  onClick={() => handleCreatePromotion(product)}
                  disabled={wasPromoted}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    wasPromoted
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {wasPromoted ? <Check size={14} /> : <Megaphone size={14} />}
                  {wasPromoted ? 'Promoção criada' : 'Criar promoção'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
