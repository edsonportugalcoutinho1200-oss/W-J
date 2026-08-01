import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getHomePathForRole, ROLE_LABELS } from '../utils/roleRoutes';

/**
 * Tela mostrada pelo ProtectedRoute quando o usuário está autenticado mas
 * não tem o papel exigido pela rota (erro 403 — "Forbidden", diferente de
 * 401 "não autenticado"). Também pode ser usada isoladamente, se algum
 * componente quiser sinalizar falta de permissão sem redirecionar.
 */
export default function AccessDenied() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const homePath = getHomePathForRole(user?.role);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <Lock className="text-rose-600" size={32} strokeWidth={2.25} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
          Erro 403 · Acesso negado
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">
          Você não tem permissão para ver esta página
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {user?.role && (
            <>
              Seu papel atual é <span className="font-medium text-slate-700">{ROLE_LABELS[user.role] ?? user.role}</span>.{' '}
            </>
          )}
          Esta área é restrita a outro nível de acesso. Se você acredita que
          isso é um engano, fale com um administrador.
        </p>

        <button
          onClick={() => navigate(homePath, { replace: true })}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <ArrowLeft size={16} />
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}
