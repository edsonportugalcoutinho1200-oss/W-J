import axios from 'axios';

/**
 * Instância central do Axios da loja (wj-acessorios).
 *
 * Mais simples que a versão do backoffice-ecommerce de propósito:
 * a loja é pública (vitrine de produtos), então não precisa de
 * interceptor de token nem de `withCredentials` — isso só é
 * necessário no painel administrativo, que exige login.
 *
 * baseURL SEM "/api" no final: o wj-api real não usa esse prefixo
 * (confirmado no main.ts — as rotas são /products, /health, etc.,
 * direto na raiz).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;