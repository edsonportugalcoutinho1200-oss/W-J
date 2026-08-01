import { AlertTriangle, PackageX } from 'lucide-react';

// Limite abaixo do qual o produto entra na lista de estoque crítico.
const CRITICAL_STOCK_THRESHOLD = 5;

export default function CriticalStockAlert({ products }) {
  const criticalProducts = products
    .filter((product) => product.stock < CRITICAL_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  return (
    <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-orange-50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
          {/* animate-pulse chama atenção sem depender de cor sozinha
              (importante também para quem tem dificuldade de distinguir cores) */}
          <AlertTriangle className="animate-pulse text-rose-600" size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-rose-800">Estoque crítico</h3>
          <p className="text-xs text-rose-600">
            {criticalProducts.length} produto(s) com menos de {CRITICAL_STOCK_THRESHOLD} unidades
          </p>
        </div>
      </div>

      {criticalProducts.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Nenhum produto em estoque crítico no momento.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {criticalProducts.map((product) => (
            <li
              key={product.id}
              className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <PackageX size={16} className="shrink-0 text-rose-500" />
                <span className="font-medium">{product.name}</span>
              </div>
              <span className="shrink-0 rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                {product.stock} un.
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
