import { UserCog } from 'lucide-react';
import PlaceholderPage from './PlaceholderPage';

export default function ConfiguracoesUsuarios() {
  return (
    <PlaceholderPage
      icon={UserCog}
      title="Configurações de Usuários"
      description="Convidar, remover e definir o papel (Admin/Vendedor) de cada usuário — restrito ao Admin."
    />
  );
}
