---
name: seguranca-env-credenciais
description: Use sempre que for mexer em arquivos .env, configuração de conexão com o MongoDB Atlas, ou sempre que um .env com valores reais aparecer em um upload, print ou cópia do projeto (não só em commits).
---

## Regra

- Nenhum `.env` real (com `MONGO_URI`, senhas, chaves) deve ser
  versionado — só os `.env.example`, sempre com os campos vazios.
- "Não versionado" não é o mesmo que "nunca exposto": se um `.env` real
  circular por upload, print, cópia de pasta ou mensagem, trate como
  vazamento e rotacione a credencial (trocar a senha do usuário do
  cluster no MongoDB Atlas) mesmo que o git nunca tenha visto o arquivo.
- Nunca copiar o conteúdo de um `.env` real para dentro de `CLAUDE.md`,
  skills, documentação ou qualquer arquivo que entre no repositório.
