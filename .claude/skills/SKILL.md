---
name: dto-e-schema-novos-modulos
description: Use ao criar qualquer módulo novo de recurso no wj-api (pedidos, categorias, usuários, etc.) ou ao revisar um módulo existente. Garante que todo dado siga o padrão DTO + Schema já estabelecido pelo módulo de Produtos, em vez de um mongoose.model() solto com campos em português.
---

## Contexto

Numa tentativa anterior, uma rota de Produto foi gerada fora deste fluxo
com campos em português (`nome`, `preco`, `descricao`) e sem validação —
registrada com `mongoose.model()` direto, fora do ciclo de vida do NestJS.
O arquivo ficou como código morto em `src/models/produto.ts` e não deve
ser usado como referência.

O padrão correto, já implementado em `src/products/`, é:

- `schemas/*.schema.ts` — `@Schema()` + `@Prop()`, com `SchemaFactory`,
  registrado via `MongooseModule.forFeature(...)` no module (nunca
  `mongoose.model()` solto — isso quebra com `--watch`, lançando
  "Cannot overwrite model once compiled").
- `dto/create-*.dto.ts` e `dto/update-*.dto.ts` — `class-validator`
  (`@IsString`, `@IsNumber`, etc.), nomes de campo em **inglês**,
  batendo exatamente com o que o frontend já consome.
- O `ValidationPipe` global (`main.ts`, com `whitelist: true` e
  `forbidNonWhitelisted: true`) já rejeita qualquer campo fora do DTO —
  não é preciso reimplementar essa checagem em cada rota, só declarar o
  DTO certo.

## Regra

Ao criar um módulo novo:

1. Copie a estrutura de `src/products/` (schema + dto + controller +
   service + module), não invente um padrão novo.
2. Nomeie campos em inglês, alinhados ao que o frontend espera — nunca
   aceitar nomenclatura em português só porque foi gerada assim por outra
   ferramenta/IA.
3. Se encontrar um `mongoose.model()` chamado fora de um `@Schema()`
   do NestJS, trate como código legado a remover, não como referência.
