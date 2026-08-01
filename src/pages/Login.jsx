import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InlineAlert from '../components/UI/InlineAlert';
import { USE_MOCKS } from '../config/mockMode';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // login vem do AuthContext e chama authService.login, que bate em
      // POST /auth/login na API.
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Mensagem genérica — nunca expor se foi o e-mail ou a senha que falhou.
      setError(err?.message || 'Credenciais inválidas.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-teal-500 font-bold text-slate-900">
            B
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Acessar o backoffice</h1>
        </div>

        {error && <InlineAlert variant="error" message={error} />}

        {USE_MOCKS && (
          <InlineAlert
            variant="info"
            message={
              'Modo demonstração: qualquer senha funciona. Use um e-mail com "vendedor" ' +
              '(ex.: vendedor@loja.com) para testar o papel de Vendedor — qualquer outro ' +
              'e-mail entra como Admin. Dá pra trocar depois pelo seletor no topo da tela.'
            }
          />
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">E-mail</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Senha</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/40"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
