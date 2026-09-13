---
name: rbac-dados-financeiros
description: Use ao criar ou alterar qualquer rota do wj-api ou tela do backoffice-ecommerce que toque em dados financeiros (faturamento, dashboard financeiro, custo, margem) ou que dependa do papel do usuário (ADMIN vs VENDEDOR).
---

## Estado atual (importante)

O RBAC do projeto tem dois papéis, `ADMIN` e `VENDEDOR`
(`backoffice-ecommerce/src/utils/roleRoutes.js`). `VENDEDOR` não deve ter
acesso ao Dashboard Financeiro.

Hoje esse controle **só existe no frontend/modo mock**
(`src/mocks/mockAuth.js` — login simulado que aceita qualquer senha e
decide o papel pelo e-mail digitado). O backend (`wj-api`) ainda não tem
nenhum guard de autenticação ou de papel — nenhuma rota de `/products`
verifica quem está chamando.

## Regra

- Nunca tratar uma tela como "protegida" só porque o frontend esconde o
  menu ou redireciona `VENDEDOR` para `/pedidos` — isso é só UX, não é
  segurança, enquanto o backend não tiver guard.
- Ao implementar autenticação real no backend, todo endpoint que retorna
  dado financeiro precisa checar o papel do usuário autenticado (guard de
  JWT + `@Roles('ADMIN')`), não confiar em nada vindo do cliente.
- Cuidado com vazamento indireto: um endpoint pensado para `VENDEDOR` (ex.
  lista de produtos) não pode incluir campos financeiros (custo, margem)
  no mesmo payload só porque é conveniente reaproveitar o schema inteiro.
- Se for adicionar o guard de autenticação, isso resolve diretamente a
  armadilha "rotas de produtos sem guard" descrita no CLAUDE.md — trate
  como uma tarefa esperada, não como bug a esconder.
