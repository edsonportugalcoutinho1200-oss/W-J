import { NavLink } from 'react-router-dom';
import {
  ClipboardList,
  Package,
  LifeBuoy,
  LineChart,
  Wallet,
  FileBarChart2,
  UserCog,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/roleRoutes';

/**
 * Menu dinâmico por papel (RBAC).
 *
 * Cada item declara quem pode vê-lo em `roles`. O Vendedor (operacional)
 * só enxerga pedidos/estoque/atendimento; o Admin enxerga tudo, incluindo
 * as abas financeiras. Isso é só a CAMADA VISUAL do controle de acesso —
 * quem realmente bloqueia a navegação por URL direta é o ProtectedRoute
 * em cada rota (ver App.jsx). Nunca confie só em esconder o botão: um
 * usuário pode digitar a URL restrita direto na barra de endereço.
 */
const NAV_SECTIONS = [
  {
    title: 'Operação',
    items: [
      { to: '/pedidos', label: 'Gestão de Pedidos', icon: ClipboardList, roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
      { to: '/estoque', label: 'Controle de Estoque', icon: Package, roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
      { to: '/atendimento', label: 'Atendimento', icon: LifeBuoy, roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
    ],
  },
  {
    title: 'Financeiro (Admin)',
    items: [
      { to: '/admin/dashboard-financeiro', label: 'Dashboard Financeiro', icon: LineChart, roles: [ROLES.ADMIN] },
      { to: '/admin/pagamentos', label: 'Pagamentos / Caixa', icon: Wallet, roles: [ROLES.ADMIN] },
      { to: '/admin/relatorios-lucro', label: 'Relatórios de Lucro', icon: FileBarChart2, roles: [ROLES.ADMIN] },
      { to: '/admin/usuarios', label: 'Configurações de Usuários', icon: UserCog, roles: [ROLES.ADMIN] },
    ],
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-slate-900 md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500 font-bold text-slate-900">
          B
        </div>
        <span className="text-lg font-semibold text-white">Backoffice</span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
              <div className="space-y-1">
                {visibleItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-500/10 text-teal-400'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-6 py-4 text-xs text-slate-500">
        v1.0.0 · Ambiente {import.meta.env.MODE}
      </div>
    </aside>
  );
}
