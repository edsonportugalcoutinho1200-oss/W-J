import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Guarda de rota no frontend, em duas camadas:
 *
 *   1. Autenticação — sem sessão válida, redireciona para /login (guarda
 *      a rota original em `state.from` para voltar pra lá depois do login).
 *
 *   2. Autorização (RBAC) — se `allowedRoles` for passado e o papel do
 *      usuário logado não estiver nessa lista, redireciona IMEDIATAMENTE
 *      para /acesso-negado, sem renderizar nada da rota protegida (nem
 *      por um instante). Isso vale mesmo para acesso direto por URL — um
 *      Vendedor digitando /admin/pagamentos na barra de endereço cai
 *      aqui do mesmo jeito que cairia clicando em algo.
 *
 * IMPORTANTE: isso é só proteção de UX/roteamento no cliente. O controle
 * de acesso real e definitivo tem que ser reforçado pela API em cada
 * endpoint (nunca confiar apenas nesta checagem) — um usuário mal
 * intencionado pode desabilitar o JavaScript ou chamar a API diretamente,
 * ignorando esta camada por completo.
 *
 * Uso:
 *   <ProtectedRoute allowedRoles={['ADMIN']}>
 *     <PaymentsPage />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasRequiredRole =
    !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  if (!hasRequiredRole) {
    return <Navigate to="/acesso-negado" replace />;
  }

  return children;
}
