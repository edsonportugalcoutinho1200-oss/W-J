import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { clearAuthToken } from '../services/api';
import { USE_MOCKS } from '../config/mockMode';

/**
 * SEGURANÇA:
 * Guardamos o token JWT em memória (state do React), NUNCA em localStorage
 * ou sessionStorage. Isso reduz a superfície de ataque contra XSS (scripts
 * maliciosos não conseguem ler window.localStorage para roubar o token).
 *
 * O trade-off é que o token some ao dar F5 — por isso o efeito de "boot"
 * abaixo chama GET /auth/me, que usa o cookie httpOnly de refresh (enviado
 * automaticamente por causa de `withCredentials: true` em services/api.js)
 * para obter um novo access token sem pedir login de novo. Se não houver
 * cookie válido, a chamada falha com 401 e o usuário simplesmente cai na
 * tela de login — é um fluxo esperado, não um erro para mostrar na tela.
 *
 * RBAC:
 * O papel (`user.role`, 'ADMIN' | 'VENDEDOR') vem sempre de dentro do
 * usuário retornado pelo login/boot de sessão — hoje simulado
 * (services/authService -> mocks/mockAuth.js), amanhã decodificado pela
 * API a partir do JWT validado no servidor. O frontend NUNCA decide o
 * papel de um usuário real; ele só lê o que a API mandou.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    setIsAuthenticated(true);
    return loggedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Mesmo se a chamada de logout falhar (ex.: sessão já expirada no
      // servidor), garantimos que o estado local fique deslogado.
      clearAuthToken();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  /**
   * Só existe (e só faz algo) no modo demonstração — é a forma "fácil de
   * alternar" para testar as duas visões sem deslogar. Fora do modo
   * demonstração, isso é um no-op proposital: trocar o papel de um usuário
   * de verdade tem que vir de um novo login/token emitido pela API, nunca
   * de uma função do cliente.
   */
  const setDemoRole = useCallback((role) => {
    if (!USE_MOCKS) return;
    setUser((prev) => (prev ? { ...prev, role } : prev));
  }, []);

  // Reage a 401 disparado pelo interceptor de resposta do Axios em
  // qualquer chamada da aplicação (não só no login).
  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Boot da aplicação: tenta restaurar a sessão via cookie httpOnly de
  // refresh antes de decidir se mostra o login ou o painel.
  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      try {
        const restoredUser = await authService.fetchCurrentSession();
        if (isMounted) {
          setUser(restoredUser);
          setIsAuthenticated(true);
        }
      } catch {
        // Sem sessão válida — comportamento normal para quem não está logado.
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    bootstrapSession();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, setDemoRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
  return ctx;
}
