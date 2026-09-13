# wj-api — Backend (NestJS + MongoDB)

API que vai atender tanto o `backoffice-ecommerce` quanto o `wj-acessorios`
(loja). Estado atual: **Etapa 1 (conexão com o banco) e Etapa 2 (módulo de
Produtos) concluídas.** Login/JWT/papéis (Etapa 3) ainda não existem.

## Passo 1 — Criar o banco no MongoDB Atlas (gratuito)

1. Acesse **https://www.mongodb.com/cloud/atlas/register** e crie uma conta
   (dá pra usar login do Google).
2. Ao criar o primeiro projeto/cluster, escolha a opção **gratuita** (M0 —
   "Free"). Pode manter as opções padrão (provedor AWS, região mais
   próxima do Brasil).
3. Vai pedir para criar um **usuário de banco de dados** — anote o usuário
   e a senha que você definir aqui (é diferente do seu login do Atlas).
4. Em **Network Access**, adicione seu IP atual, ou (mais simples para
   desenvolvimento) libere `0.0.0.0/0` ("Allow access from anywhere") —
   dá pra restringir depois, quando for para produção.
5. Em **Database → Connect → Drivers**, copie a "connection string" e monte
   sua `MONGO_URI` (ver `.env.example`).

## Passo 2 — Rodar o projeto

```bash
npm install
```
No Windows, use `copy` em vez de `cp`:
```
copy .env.example .env
```
Abra o `.env` recém-criado e cole sua connection string na variável
`MONGO_URI`.

```bash
npm run start:dev
```

Se aparecer `wj-api rodando em http://localhost:3000` no terminal, e
**http://localhost:3000/health** responder `"mongo": "conectado"`, está tudo
certo.

## Estrutura atual

```
src/
  main.ts                    ponto de entrada — CORS, porta, ValidationPipe global
  app.module.ts               módulo raiz (junta tudo)
  app.controller.ts           rota GET /health
  app.service.ts               checa o status da conexão com o Mongo
  config/
    database.module.ts        conexão com o MongoDB via Mongoose
  products/
    products.module.ts        registra o schema de Produto no Mongoose
    products.controller.ts    rotas GET/POST/PATCH/DELETE /products
    products.service.ts       regra de negócio / acesso ao banco
    schemas/product.schema.ts  formato do documento no MongoDB
    dto/
      create-product.dto.ts   validação do corpo do POST
      update-product.dto.ts   validação do corpo do PATCH (campos opcionais)
```

## Testando a rota de Produtos

Com o servidor rodando, use o Thunder Client (extensão do VS Code) ou
Postman/Insomnia:

**Criar um produto — `POST http://localhost:3000/products`**, aba Body →
JSON:
```json
{
  "name": "Corrente de Prata 925",
  "sku": "COR-PRT-001",
  "category": "Correntes",
  "price": 129.90,
  "stock": 12,
  "imageUrl": "https://exemplo.com/corrente.jpg"
}
```
Deve voltar `201 Created` com o produto salvo, incluindo um campo `id`.

**Listar — `GET http://localhost:3000/products`**

**O que acontece se você mandar algo errado (isso é o esperado, não bug):**
- Faltar um campo obrigatório (ex.: sem `price`) → `400 Bad Request`
  explicando qual campo falhou.
- Mandar um campo que não existe no contrato (ex.: `"cor": "prata"`) →
  `400 Bad Request` — o `ValidationPipe` rejeita em vez de silenciosamente
  ignorar (ver `forbidNonWhitelisted` em `main.ts`).
- Repetir um `sku` que já existe → `409 Conflict`.

## ⚠️ Segurança — pendência conhecida (não esquecida)

As rotas de `/products` ainda **não têm autenticação**. Qualquer pessoa que
souber a URL pode criar/editar/remover produtos agora. Isso é proposital
nesta etapa — o guard de JWT + papel (`@Roles('ADMIN')` nas rotas de
escrita) entra na **Etapa 3**, junto com o módulo de autenticação. Não usar
esta API como está, exposta publicamente, em produção.

## Próxima etapa

**Etapa 3 — Autenticação + JWT + Roles**: módulo de login com hash de
senha, emissão de JWT com o `role` (`ADMIN`/`VENDEDOR`) e um *guard* que
bloqueia as rotas de escrita de Produtos para quem não for Admin — o
mesmo RBAC que já existe no frontend, mas reforçado de verdade no servidor.
