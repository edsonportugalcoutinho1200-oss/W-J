/**
 * Fonte única de verdade para "qual é a rota inicial de cada papel".
 * Usado pelo redirecionamento de "/" (App.jsx) e pelo botão "Voltar ao
 * Início" da tela de acesso negado (AccessDenied.jsx) — assim os dois
 * nunca ficam dessincronizados.
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  VENDEDOR: 'VENDEDOR',
};

export const ROLE_LABELS = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
};

export function getHomePathForRole(role) {
  // O Vendedor não tem acesso ao Dashboard Financeiro (dados sensíveis de
  // faturamento/lucro) — a home dele é a tela operacional de Pedidos.
  return role === ROLES.ADMIN ? '/admin/dashboard-financeiro' : '/pedidos';
}
