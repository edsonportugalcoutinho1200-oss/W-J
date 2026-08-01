import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_LABELS } from '../../utils/roleRoutes';
import { USE_MOCKS } from '../../config/mockMode';

/**
 * Alternador de papel só para teste no modo demonstração — troca
 * `user.role` instantaneamente, sem precisar deslogar/logar de novo.
 *
 * Renderiza `null` fora do modo demonstração de propósito: em um usuário
 * real, o papel vem do JWT validado pela API, e não faria sentido (nem
 * seria seguro) deixar esse controle exposto na interface de produção.
 */
export default function RoleSwitcher() {
  const { user, setDemoRole } = useAuth();

  if (!USE_MOCKS || !user) return null;

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs">
      {Object.values(ROLES).map((role) => (
        <button
          key={role}
          onClick={() => setDemoRole(role)}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            user.role === role
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="Alternar papel só para teste (modo demonstração)"
        >
          {ROLE_LABELS[role]}
        </button>
      ))}
    </div>
  );
}
