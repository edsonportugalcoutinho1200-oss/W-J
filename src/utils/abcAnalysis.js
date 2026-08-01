/**
 * Curva ABC (Análise de Pareto) — regra 80/20.
 *
 * Ordena os produtos por faturamento (desc), calcula o percentual
 * acumulado de cada um e classifica em:
 *   A -> produtos que, somados, respondem por até 80% do faturamento
 *   B -> de 80% a 95%
 *   C -> "cauda longa": os últimos 5%
 *
 * Mantido como função pura (sem JSX/estado) para poder ser testado
 * isoladamente e reaproveitado fora do gráfico, se necessário.
 */

export function buildParetoData(products) {
  const sorted = [...products].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = sorted.reduce((sum, p) => sum + p.revenue, 0);

  let cumulativeRevenue = 0;

  return sorted.map((product) => {
    cumulativeRevenue += product.revenue;
    const cumulativePercentage =
      totalRevenue > 0 ? (cumulativeRevenue / totalRevenue) * 100 : 0;

    return {
      ...product,
      cumulativePercentage: Number(cumulativePercentage.toFixed(1)),
      classification: classify(cumulativePercentage),
    };
  });
}

function classify(cumulativePercentage) {
  if (cumulativePercentage <= 80) return 'A';
  if (cumulativePercentage <= 95) return 'B';
  return 'C';
}

/**
 * Resume a "zona de Pareto": quantos produtos (classe A) concentram a maior
 * parte do faturamento, para exibir algo como "4 de 12 produtos (33%)
 * concentram ~80% do faturamento".
 */
export function summarizeParetoZone(paretoData) {
  const classA = paretoData.filter((p) => p.classification === 'A');
  return {
    productCount: classA.length,
    totalCount: paretoData.length,
    productShare: paretoData.length
      ? Math.round((classA.length / paretoData.length) * 100)
      : 0,
  };
}
