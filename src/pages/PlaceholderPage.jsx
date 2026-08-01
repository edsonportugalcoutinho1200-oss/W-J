/**
 * Placeholder genérico para seções que ainda não têm funcionalidade
 * própria implementada — mantém a navegação (e o RBAC) já testável de
 * ponta a ponta antes de cada tela ganhar sua implementação real.
 */
export default function PlaceholderPage({ icon: Icon, title, description }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Icon size={22} className="text-slate-400" />
          </div>
        )}
        <p className="text-sm text-slate-500">Esta seção ainda está em construção.</p>
      </div>
    </div>
  );
}
