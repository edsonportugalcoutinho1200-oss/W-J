/**
 * MOCK DATA — Inteligência de Vendas e Estoque.
 *
 * Substituir por uma chamada real assim que existir um endpoint agregador
 * na API, por exemplo:
 *   GET /dashboard/sales-intelligence
 *   -> [{ id, name, sku, revenue, stock, lastSaleAt }]
 *
 * O formato abaixo já é o formato final esperado pelos componentes
 * (ParetoChart, CriticalStockAlert, StagnantProducts), então trocar o mock
 * por `await api.get('/dashboard/sales-intelligence')` no Dashboard.jsx é a
 * única mudança necessária no futuro.
 *
 * `lastSaleAt` é calculado a partir de "hoje" (via `daysAgo`) para que a
 * regra de "sem vendas há 30+ dias" continue fazendo sentido não importa
 * quando este código rodar — em um mock estático com datas fixas, a regra
 * "quebraria" com o tempo.
 */

function daysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString();
}

export const mockProductsPerformance = [
  { id: 1, name: 'Fone de Ouvido Bluetooth', sku: 'FONE-BT-001', revenue: 18500, stock: 32, lastSaleAt: daysAgo(1) },
  { id: 2, name: 'Smartwatch Sport X2', sku: 'SMTW-SPX-002', revenue: 15200, stock: 3, lastSaleAt: daysAgo(2) },
  { id: 3, name: 'Mochila Executiva', sku: 'MOCH-EXE-014', revenue: 9800, stock: 18, lastSaleAt: daysAgo(4) },
  { id: 4, name: 'Caixa de Som Portátil', sku: 'CAIX-SOM-005', revenue: 7400, stock: 4, lastSaleAt: daysAgo(1) },
  { id: 5, name: 'Garrafa Térmica 1L', sku: 'GARR-TER-002', revenue: 4200, stock: 58, lastSaleAt: daysAgo(3) },
  { id: 6, name: 'Suporte para Notebook', sku: 'SUPO-NOT-009', revenue: 2600, stock: 26, lastSaleAt: daysAgo(45) },
  { id: 7, name: 'Teclado Mecânico Compacto', sku: 'TECL-MEC-011', revenue: 2100, stock: 2, lastSaleAt: daysAgo(6) },
  { id: 8, name: 'Luminária de Mesa LED', sku: 'LUMI-LED-020', revenue: 1450, stock: 14, lastSaleAt: daysAgo(50) },
  { id: 9, name: 'Capa para Notebook 15"', sku: 'CAPA-NOT-015', revenue: 980, stock: 21, lastSaleAt: daysAgo(38) },
  { id: 10, name: 'Mouse Vertical Ergonômico', sku: 'MOUS-VER-007', revenue: 720, stock: 9, lastSaleAt: daysAgo(9) },
  { id: 11, name: 'Organizador de Cabos', sku: 'ORGA-CAB-003', revenue: 340, stock: 40, lastSaleAt: daysAgo(60) },
  { id: 12, name: 'Suporte de Celular Veicular', sku: 'SUPO-CEL-018', revenue: 210, stock: 1, lastSaleAt: daysAgo(70) },
];
