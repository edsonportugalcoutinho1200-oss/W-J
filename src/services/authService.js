import api, { setAuthToken, clearAuthToken } from './api';
import { USE_MOCKS } from '../config/mockMode';
import { mockLogin, mockCurrentSession } from '../mocks/mockAuth';

/**
 * Contrato esperado da API (Node/NestJS):
 *
 * POST /auth/login   body: { email, password }
 *                     resp: { accessToken, user: { name, role, email } }
 *                     + Set-Cookie httpOnly com o refresh token
 *
 * POST /auth/logout   invalida o refresh token no servidor e limpa o cookie
 *
 * GET  /auth/me        usa o cookie httpOnly de refresh para emitir um novo
 *                      accessToken sem exigir login novamente (chamado no
 *                      boot do AuthProvider). 401 se não houver sessão válida.
 *
 * Nenhuma dessas rotas deve devolver a senha/hash, nem detalhes internos
 * de erro — só o necessário para a UI (ver normalizeError em services/api.js).
 */

export async function login(email, password) {
  if (USE_MOCKS) {
    const user = await mockLogin(email);
    setAuthToken('mock-token');
    return user;
  }
  const { data } = await api.post('/auth/login', { email, password });
  setAuthToken(data.accessToken);
  return data.user;
}

export async function logout() {
  if (USE_MOCKS) {
    clearAuthToken();
    return;
  }
  try {
    await api.post('/auth/logout');
  } finally {
    // Mesmo que a chamada falhe (ex.: já sem sessão), garante estado limpo local.
    clearAuthToken();
  }
}

export async function fetchCurrentSession() {
  if (USE_MOCKS) return mockCurrentSession();
  const { data } = await api.get('/auth/me');
  setAuthToken(data.accessToken);
  return data.user;
}
