/**
 * Camada de sanitização/validação NO FRONTEND.
 *
 * IMPORTANTE: isto é uma barreira de UX e defesa em profundidade, NUNCA a
 * única proteção. A validação/sanitização definitiva (parametrização de
 * queries, escaping, allowlists) DEVE ser refeita no backend (Node/NestJS)
 * antes de qualquer persistência no MongoDB/Postgres. Nunca confie em input
 * validado só no cliente.
 */

// Allowlist para nome de produto: letras (com acentos), números, espaço e
// uma pontuação básica seguros para exibição/URLs (evita depender de uma
// lista de "caracteres proibidos", sempre incompleta por natureza).
// Importante: NÃO bloqueia palavras inteiras (ex.: um produto chamado
// "Where's Wally" não seria mais barrado por conter a palavra "where").
//
// Duas instâncias do mesmo padrão: uma com /g para uso em .replace()
// (sanitizeText) e outra sem /g para uso em .test() — regex global reusada
// em .test() mantém `lastIndex` entre chamadas e pode dar falso-negativo
// intermitente na segunda validação do mesmo valor.
const SAFE_TEXT_REPLACE_REGEX = /[^\p{L}\p{N}\s.,'()&\-]/gu;
const SAFE_TEXT_TEST_REGEX = /[^\p{L}\p{N}\s.,'()&\-]/u;

// Bloqueia chaves de operadores do MongoDB caso um objeto seja montado a
// partir de input do usuário (ex.: { name: { $ne: null } }).
const MONGO_OPERATOR_KEY_REGEX = /^\$/;

/**
 * Remove caracteres fora da allowlist de um texto simples (nome de
 * produto, etc). Não usar em campos que legitimamente aceitam HTML/markdown.
 */
export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(SAFE_TEXT_REPLACE_REGEX, '').trim();
}

/**
 * Garante que um payload de objeto (antes de enviar para a API) não contenha
 * chaves de operadores do Mongo (ex.: "$set", "$where") injetadas via
 * inputs dinâmicos ou JSON.parse de dados do usuário.
 */
export function stripMongoOperators(obj) {
  if (Array.isArray(obj)) return obj.map(stripMongoOperators);
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (MONGO_OPERATOR_KEY_REGEX.test(key)) return acc; // descarta a chave
      acc[key] = stripMongoOperators(value);
      return acc;
    }, {});
  }
  return obj;
}

/**
 * Validadores de campo, usados no formulário de produto.
 * Cada validador retorna string de erro (ou null se válido).
 */
export const validators = {
  productName(value) {
    const v = (value || '').trim();
    if (!v) return 'Informe o nome do produto.';
    if (v.length < 3) return 'O nome deve ter ao menos 3 caracteres.';
    if (v.length > 120) return 'O nome deve ter no máximo 120 caracteres.';
    if (SAFE_TEXT_TEST_REGEX.test(v)) {
      return 'O nome contém caracteres não permitidos. Use apenas letras, números e pontuação básica.';
    }
    return null;
  },

  price(value) {
    const v = String(value ?? '').trim();
    if (!v) return 'Informe o preço.';
    if (!/^\d+(\.\d{1,2})?$/.test(v)) {
      return 'Use um valor numérico válido (ex.: 199.90).';
    }
    if (Number(v) <= 0) return 'O preço deve ser maior que zero.';
    return null;
  },

  stock(value) {
    const v = String(value ?? '').trim();
    if (!v) return 'Informe o estoque.';
    if (!/^\d+$/.test(v)) return 'O estoque deve ser um número inteiro positivo.';
    return null;
  },

  sku(value) {
    const v = (value || '').trim();
    if (!v) return 'Informe o SKU.';
    // Allowlist: apenas letras, números e hífen.
    if (!/^[A-Za-z0-9-]{3,32}$/.test(v)) {
      return 'O SKU deve conter apenas letras, números e hífen (3-32 caracteres).';
    }
    return null;
  },

  category(value) {
    const v = (value || '').trim();
    if (!v) return 'Selecione uma categoria.';
    return null;
  },
};
