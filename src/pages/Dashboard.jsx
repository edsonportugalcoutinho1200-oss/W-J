import { useEffect, useState } from 'react';
import { DollarSign, Clock, AlertTriangle, ShoppingBag } from 'lucide-react';
import SummaryCard from '../components/Dashboard/SummaryCard';
import ParetoChart from '../components/Dashboard/ParetoChart';
import CriticalStockAlert from '../components/Dashboard/CriticalStockAlert';
import StagnantProducts from '../components/Dashboard/StagnantProducts';
import InlineAlert from '../components/UI/InlineAlert';
import { getDashboardSummary } from '../services/dashboardService';
// Inteligência de vendas/estoque ainda não tem endpoint próprio na API —
// ver src/mocks/salesIntelligence.js para o formato esperado do futuro
// GET /dashboard/sales-intelligence.
import { mockProductsPerformance } from '../mocks/salesIntelligence';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [promotionFeedback, setPromotionFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardSummary();
        if (isMounted) setSummary(data);
      } catch (err) {
        // err já vem normalizado pelo interceptor do axios (services/api.js):
        // nunca é o objeto de erro cru, sempre { code, message, status }.
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  function handleCreatePromotion(product) {
    setPromotionFeedback(
      `Promoção simulada criada para "${product.name}". Ligue este botão a um endpoint real (ex.: POST /marketing/promotions) quando existir.`
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard Financeiro</h2>
        <p className="text-sm text-slate-500">
          Faturamento, curva ABC e estoque — visão restrita ao Admin.
        </p>
      </div>

      {error && (
        <InlineAlert variant="error" title="Não foi possível carregar o resumo" message={error} />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={DollarSign}
          label="Faturamento (mês)"
          value={isLoading || !summary ? '—' : summary.revenue}
          hint="Comparado ao período anterior"
        />
        <SummaryCard
          icon={Clock}
          label="Pedidos pendentes"
          value={isLoading || !summary ? '—' : summary.pendingOrders}
          hint="Aguardando aprovação"
          tone="warning"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Alertas de estoque"
          value={isLoading || !summary ? '—' : summary.lowStockAlerts}
          hint="Produtos com estoque baixo"
          tone="danger"
        />
        <SummaryCard
          icon={ShoppingBag}
          label="Pedidos no mês"
          value={isLoading || !summary ? '—' : summary.totalOrders}
          hint="Total de pedidos recebidos"
        />
      </div>

      {/* ---- Inteligência de Vendas e Estoque ---- */}
      <ParetoChart products={mockProductsPerformance} />

      {promotionFeedback && (
        <InlineAlert
          variant="success"
          message={promotionFeedback}
          onClose={() => setPromotionFeedback(null)}
        />
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CriticalStockAlert products={mockProductsPerformance} />
        <StagnantProducts products={mockProductsPerformance} onCreatePromotion={handleCreatePromotion} />
      </div>
    </div>
  );
}
