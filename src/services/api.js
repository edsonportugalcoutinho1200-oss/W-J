import axios from 'axios';
import { stripMongoOperators } from '../utils/sanitize';

/**
 * Instância central do Axios — é o ÚNICO ponto do frontend que fala com a
 * API (Node/NestJS). O frontend nunca acessa MongoDB/Supabase diretamente;
 * "conectar ao banco" aqui significa: bater nos endpoints REST abaixo com
 * contrato estável, e deixar toda regra de acesso/persistência para a API.
 *
 * SEGURANÇA:
 * - O token JWT é injetado automaticamente em todas as requisições via
 *   interceptor (Authorization: Bearer <token>), evitando que cada chamada
 *   precise lembrar de anexar o header manualmente (mitiga Broken Access
 *   Control por esquecimento).
 * - `withCredentials: true` permite que um cookie httpOnly de refresh
 *   (emitido pela API no login) trafegue automaticamente nas chamadas para
 *   a API — é o que possibilita restaurar a sessão após F5 sem guardar o
 *   access token em localStorage (ver AuthContext). Exige que o backend
 *   configure CORS com `credentials: true` e uma origin explícita (nunca
 *   `*` quando `credentials` está ligado).
 * - Todo corpo de requisição (POST/PUT/PATCH) passa por
 *   `stripMongoOperators`, removendo recursivamente qualquer chave que
 *   comece com "$" (ex.: `$where`, `$ne`, `$set`) antes de sair do
 *   navegador — reforço automático contra NoSQL Injection em TODOS os
 *   formulários, não só no de produtos.
 * - Erros de rede/CORS são normalizados para mensagens genéricas antes de
 *   chegar na UI, evitando vazar detalhes de infraestrutura (URLs internas,
 *   stack traces, headers) para o usuário final.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Request Interceptor: injeta o Bearer Token + sanitiza o payload ----
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data && typeof config.data === 'object') {
      config.data = stripMongoOperators(config.data);
    }

    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// ---- Response Interceptor: trata 401/403 e erros de rede/CORS ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 -> token ausente/expirado: força logout local.
    if (error?.response?.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return Promise.reject(normalizeError(error));
  }
);

/**
 * Converte qualquer erro do Axios em um objeto padronizado e "seguro para exibir".
 * Nunca repassamos error.stack, error.config ou corpo bruto da resposta para a tela.
 */
function normalizeError(error) {
  // Erro de rede / CORS bloqueado: o Axios não tem "response" nesses casos.
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message:
        'Não foi possível se comunicar com o servidor. Verifique sua conexão e tente novamente.',
      status: null,
    };
  }

  const status = error.response.status;
  const genericMessages = {
    400: 'Os dados enviados são inválidos.',
    401: 'Sua sessão expirou. Faça login novamente.',
    403: 'Você não tem permissão para executar esta ação.',
    404: 'Recurso não encontrado.',
    409: 'Conflito ao processar a solicitação.',
    422: 'Não foi possível validar os dados enviados.',
    500: 'Ocorreu um erro inesperado no servidor.',
  };

  return {
    code: `HTTP_${status}`,
    message: genericMessages[status] || 'Ocorreu um erro inesperado. Tente novamente.',
    status,
  };
}

// ---- Gestão simples do token (ver src/contexts/AuthContext.jsx) ----
let inMemoryToken = null;

export function setAuthToken(token) {
  inMemoryToken = token;
}

export function getAuthToken() {
  return inMemoryToken;
}

export function clearAuthToken() {
  inMemoryToken = null;
}

export default api;
