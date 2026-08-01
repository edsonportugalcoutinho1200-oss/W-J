import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Atendimento from './pages/Atendimento';
import Pagamentos from './pages/Pagamentos';
import RelatoriosLucro from './pages/RelatoriosLucro';
import ConfiguracoesUsuarios from './pages/ConfiguracoesUsuarios';
import { USE_MOCKS } from './config/mockMode';
import { ROLES, getHomePathForRole } from './utils/roleRoutes';

// Manda "/" para a home certa de cada papel — Admin cai no Dashboard
// Financeiro, Vendedor cai direto em Pedidos (ele não tem acesso ao
// financeiro, então não faz sentido a home dele apontar pra lá).
function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePathForRole(user?.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Visível de propósito: um modo demonstração "silencioso" é o tipo
            de coisa que vaza sem querer para produção. Isso torna impossível
            não perceber que os dados na tela não são reais. */}
        {USE_MOCKS && (
          <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
            Modo demonstração — os dados são simulados, nenhuma chamada real é
            feita à API. Desative em <code>.env</code> (VITE_USE_MOCKS=false)
            quando o backend estiver pronto.
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Também exige sessão válida — sem estar logado, cai no /login
              antes mesmo de decidir se é 403 (401 sempre vem antes de 403). */}
          <Route
            path="/acesso-negado"
            element={
              <ProtectedRoute>
                <AccessDenied />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomeRedirect />} />

            {/* ---- Operacional: Admin e Vendedor ---- */}
            <Route path="pedidos" element={<Orders />} />
            <Route path="estoque" element={<Products />} />
            <Route path="atendimento" element={<Atendimento />} />

            {/* ---- Exclusivo do Admin ----
                Cada rota tem seu próprio ProtectedRoute com allowedRoles.
                Isso bloqueia acesso direto por URL (ex.: um Vendedor
                digitando /admin/pagamentos na barra de endereço), não só
                o botão escondido no menu. */}
            <Route
              path="admin/dashboard-financeiro"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/pagamentos"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <Pagamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/relatorios-lucro"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <RelatoriosLucro />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <ConfiguracoesUsuarios />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
