# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar neste repositório.

## Idioma

Documentação, commits e comentários deste repositório são em português.

## Projeto

Monorepo (pasta `W-J-main`) com três partes:

- **wj-acessorios** (loja) — React 19 + Vite 8 + Tailwind CSS
- **backoffice-ecommerce** (painel admin) — React 18 + Vite 5 + Tailwind CSS +
  axios + react-router-dom + recharts. RBAC com papéis `ADMIN` e `VENDEDOR`.
- **wj-api** (backend) — NestJS 10 + Mongoose 8 + class-validator/class-transformer

## Comandos

```
# loja (wj-acessorios)
npm run dev       # Vite, porta padrão 5173
npm run build
npm run lint       # oxlint
npm run preview

# backoffice (backoffice-ecommerce)
npm run dev        # Vite — precisa rodar em porta diferente da loja se os dois
                    # subirem juntos (padrão do Vite é 5173 pros dois)
npm run build
npm run preview
# (sem script de lint configurado ainda)

# backend (wj-api)
npm run start:dev   # Nest com --watch
npm run build        # nest build
npm run start:debug
# (sem suíte de testes configurada ainda)
```

Rota de saúde do backend: `GET /health`.

## Variáveis de ambiente

- `wj-api/.env`: `MONGO_URI` (obrigatório — a app recusa subir sem ele,
  de propósito), `PORT` (padrão 3000), `CORS_ORIGIN` (padrão
  `http://localhost:5173`).
- `backoffice-ecommerce/.env`: `VITE_USE_MOCKS` (quando `true`, todo
  login/produto/pedido usa dados simulados em `src/mocks/` em vez da API —
  **nunca deixar `true` em produção**, o login simulado aceita qualquer
  senha), `VITE_API_BASE_URL` (padrão `http://localhost:3000/api`).
- Nenhum `.env` real deve ser versionado — só os `.env.example`. Ver skill
  `seguranca-env-credenciais`.

## Contrato de Produto

Fonte da verdade: `wj-api/src/products/schemas/product.schema.ts` +
`create-product.dto.ts`. Campos em **inglês**, porque é o contrato que o
frontend (`backoffice-ecommerce/src/services/productsService.js`) já foi
construído em cima:

```
Product = { id, name, sku, category, price, stock, imageUrl }
```

A API já valida isso globalmente (`ValidationPipe` com `whitelist` +
`forbidNonWhitelisted` + `transform` em `main.ts`) — qualquer campo fora do
DTO é rejeitado automaticamente. Todo módulo novo deve seguir o mesmo
padrão: `@Schema()`/`@Prop()` + DTO com `class-validator`, nunca um
`mongoose.model()` solto. Ver skill `dto-e-schema-novos-modulos`.

## RBAC

Papéis: `ADMIN` e `VENDEDOR` (fonte: `backoffice-ecommerce/src/utils/roleRoutes.js`).
`VENDEDOR` não deve ver o Dashboard Financeiro. **Importante**: hoje esse
controle só existe no frontend/mock (`src/mocks/mockAuth.js`) — o backend
(`wj-api`) ainda não tem guard de autenticação/papel em nenhuma rota. Ver
skill `rbac-dados-financeiros` antes de mexer em qualquer rota sensível.

## Armadilhas conhecidas

- `wj-api/src/models/produto.ts` (e o `.js` compilado junto) é **código
  morto** de uma tentativa anterior — campos em português
  (`nome`, `preco`, `descricao`, `emEstoque`), sem DTO, registrado direto
  com `mongoose.model()` fora do NestJS. Não usar como referência, não
  reaproveitar. O contrato real é `products/schemas/product.schema.ts`.
- As rotas `POST/PATCH/DELETE /products` **não têm guard de autenticação
  ainda** — isso é proposital (pendência da etapa atual, guard de JWT +
  `@Roles('ADMIN')` está planejado para depois), mas não é seguro para
  produção como está. Não presumir que já está protegido.
- Um `.env` com credencial real do MongoDB Atlas chegou a ser
  compartilhado fora do repositório (não está versionado no git, mas
  circulou por upload) — a senha desse usuário do cluster deve ser trocada
  no Atlas assim que possível. Ver skill `seguranca-env-credenciais`.

## Skills do projeto

Ver `.claude/skills/` — cada arquivo documenta uma decisão de design ou um
incidente já resolvido. Consulte antes de "corrigir" algo que pode ser
intencional.
