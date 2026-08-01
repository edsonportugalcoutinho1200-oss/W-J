# Backoffice E-commerce — Frontend (React + Vite + Tailwind)

Painel administrativo do e-commerce. Este projeto é **só o frontend**: ele
nunca fala com MongoDB/Supabase diretamente — tudo passa pela API Node
(NestJS) através de `src/services/*.js`. "Conectar ao banco", do ponto de
vista deste repositório, significa implementar os endpoints do contrato
abaixo na API.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

O `.env.example` já vem com `VITE_USE_MOCKS=true` — ou seja, **por padrão o
projeto roda em modo demonstração**, sem precisar de nenhuma API no ar:
login aceita qualquer e-mail/senha, e todas as telas usam dados simulados
de `src/mocks/*`. Você vai ver uma faixa amarela no topo confirmando isso.

Quando a API (NestJS) estiver pronta: mude `VITE_USE_MOCKS` para `false` no
seu `.env` e ajuste `VITE_API_BASE_URL` para a URL real. Cada arquivo em
`src/services/*.js` já tem o branch pronto (`if (USE_MOCKS) ... else ...`)
— nenhuma página precisa mudar.

**Se aparecer "Não foi possível se comunicar com o servidor":** confira se
`VITE_USE_MOCKS=true` está no seu `.env` — sem isso, o app tenta falar com
uma API real que ainda não existe.

## Controle de Acesso por Papel (RBAC)

Existem dois papéis: **ADMIN** (dono/patrão) e **VENDEDOR** (operacional).
O Vendedor não enxerga nada de financeiro — nem no menu, nem por URL direta.

| Rota                             | Tela                        | Quem acessa        |
|-----------------------------------|------------------------------|--------------------|
| `/pedidos`                        | Gestão de Pedidos            | Admin + Vendedor   |
| `/estoque`                        | Controle de Estoque          | Admin + Vendedor   |
| `/atendimento`                     | Atendimento                  | Admin + Vendedor   |
| `/admin/dashboard-financeiro`      | Dashboard Financeiro (Curva ABC/KPIs) | **Só Admin** |
| `/admin/pagamentos`                | Pagamentos / Caixa           | **Só Admin**       |
| `/admin/relatorios-lucro`          | Relatórios de Lucro          | **Só Admin**       |
| `/admin/usuarios`                  | Configurações de Usuários    | **Só Admin**       |
| `/acesso-negado`                   | Erro 403                     | qualquer logado    |

**Como testar os dois papéis (modo demonstração):**
- Rápido: use o seletor "Administrador / Vendedor" que aparece no
  cabeçalho (só existe com `VITE_USE_MOCKS=true`) — troca o papel na hora,
  sem precisar deslogar.
- Via login: entre com um e-mail contendo `vendedor` (ex.:
  `vendedor@loja.com`) para cair como Vendedor; qualquer outro e-mail
  entra como Admin.
- Para confirmar que o bloqueio é real e não só visual: logado como
  Vendedor, digite `/admin/pagamentos` direto na barra de endereço — deve
  cair na tela de Acesso Negado (403), mesmo sem esse link aparecer no menu.

**Peças da camada de segurança:**
- `contexts/AuthContext.jsx` — guarda `user.role` junto com a sessão. Em
  produção, o papel vem sempre de dentro do JWT validado pela API; o
  `setDemoRole` exposto pelo contexto só funciona com `VITE_USE_MOCKS=true`
  e é um no-op fora do modo demonstração.
- `components/Layout/ProtectedRoute.jsx` — recebe `allowedRoles` (array
  opcional). Primeiro checa autenticação (sem sessão → `/login`), depois
  autorização (papel fora da lista → `/acesso-negado`, imediatamente,
  antes de renderizar qualquer conteúdo da rota).
- `components/Layout/Sidebar.jsx` — filtra os itens de menu pelo papel
  atual. É só a camada visual: esconder o botão não substitui o
  `ProtectedRoute` em cada rota (ver `App.jsx`).
- `pages/AccessDenied.jsx` — tela de erro 403, com botão que devolve o
  usuário para a home do papel dele (`utils/roleRoutes.js`).

**Sobre o que já é e o que ainda não é dado financeiro sensível:** preço de
venda e estoque (Produtos/Estoque) ficam visíveis para os dois papéis —
não são segredo, o próprio cliente vê o preço na loja. O que é
efetivamente sensível (faturamento, curva ABC, margem/lucro, fluxo de
caixa) está isolado nas rotas `/admin/*`. Se no futuro custo/margem
entrarem na tela de Produtos, aí sim vale esconder esses campos
especificamente para o Vendedor (ver "Próximos passos").

## Estrutura de pastas

```
src/
  components/
    Layout/       Sidebar, Header, RoleSwitcher, MainLayout, ProtectedRoute
    Dashboard/    SummaryCard, ParetoChart, CriticalStockAlert, StagnantProducts
    Products/     ProductsTable, ProductForm
    Orders/       OrdersList, OrderStatusBadge
    UI/           InlineAlert (feedback genérico de erro/sucesso)
  pages/          Dashboard (financeiro), Products, Orders, Login,
                  AccessDenied, Atendimento, Pagamentos, RelatoriosLucro,
                  ConfiguracoesUsuarios, PlaceholderPage
  contexts/       AuthContext (sessão, papel, boot, setDemoRole)
  services/       api.js (Axios + interceptors) e um arquivo por recurso:
                  authService, productsService, ordersService, dashboardService
                  — cada um alterna entre API real e mock via USE_MOCKS
  mocks/          dados simulados (mockAuth com as personas ADMIN/VENDEDOR,
                  mockProducts, mockOrders, mockDashboardSummary,
                  salesIntelligence)
  config/         mockMode.js (flag USE_MOCKS + mockDelay)
  utils/          sanitize.js, abcAnalysis.js (Curva ABC) e
                  roleRoutes.js (rota inicial por papel)
```

Cada página (`pages/*.jsx`) só conhece o `services/*Service.js` correspondente
— nunca monta URL ou chama `api` diretamente. Isso mantém um único lugar
por recurso para ajustar quando o contrato da API mudar.

## Contrato REST esperado da API

| Recurso   | Endpoint                        | Uso |
|-----------|----------------------------------|-----|
| Auth      | `POST /auth/login`               | `{ email, password }` → `{ accessToken, user: { name, role, email } }` + cookie httpOnly de refresh. `user.role` deve ser `"ADMIN"` ou `"VENDEDOR"`. |
| Auth      | `POST /auth/logout`              | invalida o refresh token no servidor |
| Auth      | `GET /auth/me`                   | usa o cookie de refresh → novo `accessToken` (boot da SPA) |
| Dashboard | `GET /dashboard/summary`         | `{ revenue, pendingOrders, lowStockAlerts, totalOrders }` — a API deve exigir papel ADMIN aqui (dado financeiro) |
| Produtos  | `GET /products`                  | lista |
| Produtos  | `POST /products`                 | cria |
| Produtos  | `PATCH /products/:id`            | edita |
| Produtos  | `DELETE /products/:id`           | remove |
| Pedidos   | `GET /orders`                    | lista |
| Pedidos   | `PATCH /orders/:id/status`       | `{ status }` → valida transição de status no servidor |

Todas as respostas de erro devem usar os códigos HTTP padrão (400/401/403/
404/409/422/500) — `normalizeError` em `services/api.js` já mapeia cada um
para uma mensagem genérica em português, então a API não precisa (e não
deve) mandar mensagens de erro detalhadas para o cliente.

**Importante:** o RBAC deste README protege a *navegação no frontend*.
A API precisa validar `user.role` (extraído do JWT assinado, nunca de um
campo solto no corpo da requisição) em cada endpoint sensível — em
especial `/dashboard/summary` e qualquer futuro endpoint de pagamentos/
relatórios de lucro. Um Vendedor autenticado consegue, em teoria, chamar
esses endpoints diretamente (via curl/Postman) contornando o frontend por
completo; só o backend impede isso de verdade.

## Decisões de segurança (frontend)

1. **JWT + cookie httpOnly de refresh (`services/api.js`, `AuthContext`)**
   O access token JWT fica em memória (state do React), nunca em
   `localStorage`, reduzindo o impacto de um XSS. `withCredentials: true`
   permite que um cookie `httpOnly` + `Secure` + `SameSite` emitido no login
   trafegue junto às chamadas; no boot da SPA, `GET /auth/me` usa esse
   cookie para emitir um novo access token e restaurar a sessão após F5,
   sem repetir o login. Um interceptor de resposta reage a `401` derrubando
   a sessão local automaticamente.

2. **RBAC em duas camadas: menu (visual) + rota (`ProtectedRoute`)**
   O `Sidebar` esconde o que o papel não deveria ver, mas quem realmente
   bloqueia é o `ProtectedRoute` com `allowedRoles` em cada rota `/admin/*`
   — funciona mesmo se alguém digitar a URL direto ou usar o botão
   voltar/avançar do navegador. Ainda assim, é só uma camada de UX: a
   proteção que vale de verdade é a da API (ver contrato REST acima).

3. **Sanitização por allowlist, não blocklist (`utils/sanitize.js`)**
   O nome do produto usa uma allowlist de caracteres (letras, números,
   espaço e pontuação básica) em vez de bloquear uma lista de caracteres
   "perigosos". Preço, estoque e SKU seguem o mesmo princípio com regex
   restritiva.

4. **Proteção contra NoSQL Injection em toda a aplicação**
   `stripMongoOperators` roda automaticamente no interceptor de requisição
   do Axios (`services/api.js`), removendo recursivamente qualquer chave
   `$algumacoisa` (`$where`, `$ne`, `$set`...) de **todo** corpo de
   POST/PUT/PATCH antes de sair do navegador.

5. **Tratamento genérico de erros de rede/CORS**
   `normalizeError` intercepta qualquer erro do Axios (incluindo CORS
   bloqueado) e devolve sempre uma mensagem amigável. Nunca exibimos
   `error.stack`, corpo bruto da resposta ou headers na tela.

6. **`.gitignore`**
   Evita versionar `node_modules/` e principalmente `.env` (que pode
   conter a URL real da API ou chaves). Só `.env.example` vai para o Git.

7. **Modo demonstração visível, não silencioso (`config/mockMode.js`)**
   `VITE_USE_MOCKS=true` liga dados simulados (incluindo o seletor de
   papel) só atrás de uma flag explícita — nunca implícito. O `App.jsx`
   mostra uma faixa amarela fixa sempre que o modo está ativo, para que
   ninguém suba isso para produção sem perceber (login e troca de papel
   simulados não existem fora desse modo).

## ⚠️ Se a API usar Supabase diretamente (em vez de um backend Node próprio)

Se em algum momento o time decidir que o **frontend** fala direto com o
Supabase (via `@supabase/supabase-js`) em vez de passar por uma API Node:

- É seguro colocar a **chave `anon`/`public`** em uma variável `VITE_*` —
  ela é feita para ser pública, desde que as tabelas tenham **Row Level
  Security (RLS)** habilitada e políticas corretas (a RLS vira o principal
  controle de acesso, incluindo o próprio RBAC — cada policy deve checar
  o papel do usuário, não só se ele está autenticado).
- **Nunca** coloque a chave `service_role` em uma variável `VITE_*` (ou em
  qualquer código de frontend). Toda variável `VITE_*` é embutida no bundle
  JavaScript e fica visível para qualquer pessoa que abrir o DevTools — a
  `service_role` ignora RLS por completo e equivale a acesso de
  administrador ao banco inteiro, inclusive para um Vendedor.

## Próximos passos sugeridos

- Implementar os endpoints do contrato acima no NestJS, com um *guard* de
  papel (`@Roles('ADMIN')` ou equivalente) em cada rota financeira —
  reforçando no servidor o que o `ProtectedRoute` já faz no cliente.
- Se custo/margem um dia entrarem na tela de Produtos, esconder esses
  campos especificamente para o Vendedor (restrição a nível de campo,
  diferente da restrição a nível de rota que já existe hoje).
- Implementar de fato as telas hoje só com placeholder: Atendimento,
  Pagamentos/Caixa, Relatórios de Lucro e Configurações de Usuários.
- Testes (Vitest + React Testing Library) para `ProtectedRoute` (garantir
  que um papel fora de `allowedRoles` sempre cai em `/acesso-negado`) e
  para os validadores de `utils/sanitize.js`.
