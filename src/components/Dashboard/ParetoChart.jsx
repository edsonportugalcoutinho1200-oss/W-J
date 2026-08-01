import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { buildParetoData, summarizeParetoZone } from '../../utils/abcAnalysis';

// Cores por classe ABC (teal para os campeões de venda, âmbar para os
// medianos, cinza para a cauda longa) — mesma paleta usada no resto do app.
const CLASS_COLORS = { A: '#0d9488', B: '#f59e0b', C: '#94a3b8' };
const CLASS_LABELS = {
  A: 'A — foco de estoque',
  B: 'B — vendas médias',
  C: 'C — cauda longa',
};

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function truncateLabel(name) {
  return name.length > 14 ? `${name.slice(0, 14)}…` : name;
}

function ParetoTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-slate-800">{item.name}</p>
      <p className="text-slate-600">Faturamento: {formatCurrency(item.revenue)}</p>
      <p className="text-slate-600">Acumulado: {item.cumulativePercentage}%</p>
      <span
        className="mt-1 inline-block rounded-full px-2 py-0.5 font-medium text-white"
        style={{ backgroundColor: CLASS_COLORS[item.classification] }}
      >
        Curva {item.classification}
      </span>
    </div>
  );
}

export default function ParetoChart({ products }) {
  const data = buildParetoData(products);
  const zone = summarizeParetoZone(data);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800">Curva ABC de faturamento</h3>
        <p className="text-sm text-slate-500">
          <span className="font-medium text-teal-700">
            {zone.productCount} de {zone.totalCount} produtos ({zone.productShare}%)
          </span>{' '}
          concentram ~80% do faturamento do período.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              interval={0}
              height={70}
              tickFormatter={truncateLabel}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              yAxisId="revenue"
              tickFormatter={(v) => `R$${Math.round(v / 1000)}k`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <YAxis
              yAxisId="percentage"
              orientation="right"
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#64748b' }}
            />
            <Tooltip content={<ParetoTooltip />} />
            <Bar yAxisId="revenue" dataKey="revenue" name="Faturamento" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.id} fill={CLASS_COLORS[entry.classification]} />
              ))}
            </Bar>
            <Line
              yAxisId="percentage"
              type="monotone"
              dataKey="cumulativePercentage"
              name="% acumulado"
              stroke="#1e293b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        {Object.entries(CLASS_LABELS).map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CLASS_COLORS[key] }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
