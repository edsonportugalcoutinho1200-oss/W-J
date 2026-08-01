/**
 * Modo demonstração.
 *
 * Quando VITE_USE_MOCKS=true (ver .env.example), os serviços em
 * src/services/*.js devolvem dados simulados em memória em vez de chamar a
 * API real — permite navegar pelo painel inteiro (login incluso) sem um
 * backend no ar, e sem cair no erro genérico de rede/CORS.
 *
 * Assim que a API (Node/NestJS) existir, é só colocar
 * VITE_USE_MOCKS=false (ou apagar a linha) no .env.
 *
 * ⚠️ NUNCA deixe VITE_USE_MOCKS=true em um ambiente de produção — o login
 * simulado aceita qualquer e-mail/senha. Por isso o App.jsx mostra um
 * aviso visível no topo da tela sempre que esse modo está ativo, para que
 * isso nunca fique ligado "sem querer".
 */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

/**
 * Pequeno atraso artificial para simular latência de rede real — ajuda a
 * testar loading states (spinners, skeletons) mesmo sem API de verdade.
 */
export function mockDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
