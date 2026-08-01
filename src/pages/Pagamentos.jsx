import { Wallet } from 'lucide-react';
import PlaceholderPage from './PlaceholderPage';

export default function Pagamentos() {
  return (
    <PlaceholderPage
      icon={Wallet}
      title="Pagamentos / Caixa"
      description="Fluxo de caixa, conciliação e repasses — dado financeiro sensível, restrito ao Admin."
    />
  );
}
