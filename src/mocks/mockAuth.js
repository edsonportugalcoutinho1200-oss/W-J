import { mockDelay } from '../config/mockMode';

/**
 * Duas personas fixas para testar o RBAC sem precisar de backend.
 * O papel usado no login é decidido pelo e-mail digitado (ver mockLogin) —
 * assim dá pra alternar só trocando o e-mail na tela de login. Também é
 * possível alternar em tempo real pelo seletor de papel no cabeçalho
 * (ver components/Layout/RoleSwitcher.jsx), disponível só no modo
 * demonstração.
 */
const MOCK_USERS = {
  ADMIN: { name: 'Ana Souza', role: 'ADMIN' },
  VENDEDOR: { name: 'Carlos Lima', role: 'VENDEDOR' },
};

/**
 * Login simulado: aceita qualquer senha. O papel é 'VENDEDOR' se o e-mail
 * contiver a palavra "vendedor" (ex.: vendedor@loja.com); qualquer outro
 * e-mail entra como 'ADMIN'. Isso é só uma conveniência do modo
 * demonstração — no backend real, o papel vem de dentro do JWT validado
 * pela API, nunca de um valor decidido no cliente.
 */
export async function mockLogin(email) {
  await mockDelay();
  const role = email?.toLowerCase().includes('vendedor') ? 'VENDEDOR' : 'ADMIN';
  return { ...MOCK_USERS[role], email };
}

/**
 * Simula "nenhuma sessão salva" no boot da aplicação — assim o modo
 * demonstração ainda passa pela tela de login (mais parecido com o fluxo
 * real) em vez de pular direto para o painel.
 */
export async function mockCurrentSession() {
  await mockDelay(200);
  const error = new Error('Nenhuma sessão simulada encontrada.');
  error.status = 401;
  throw error;
}
