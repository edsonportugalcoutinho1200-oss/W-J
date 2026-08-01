import { useState } from 'react';
import { validators, sanitizeText, stripMongoOperators } from '../../utils/sanitize';
import InlineAlert from '../UI/InlineAlert';

const INITIAL_STATE = {
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: '',
};

const CATEGORIES = ['Eletrônicos', 'Moda', 'Casa', 'Beleza', 'Esporte'];

export default function ProductForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field) {
    return (event) => {
      // Sanitização "on-the-fly": bloqueia caracteres perigosos já na digitação
      // para nome e SKU. Preço/estoque ficam restritos a dígitos pela própria
      // validação abaixo.
      const rawValue = event.target.value;
      const value = field === 'name' || field === 'sku' ? sanitizeText(rawValue) : rawValue;

      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: null }));
    };
  }

  function validateAll(currentForm) {
    return {
      name: validators.productName(currentForm.name),
      sku: validators.sku(currentForm.sku),
      category: validators.category(currentForm.category),
      price: validators.price(currentForm.price),
      stock: validators.stock(currentForm.stock),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError(null);

    const validation = validateAll(form);
    setErrors(validation);

    const hasErrors = Object.values(validation).some(Boolean);
    if (hasErrors) return;

    // Camada extra de defesa: remove qualquer chave estilo "$operador" antes
    // de montar o payload que seguirá para a API.
    const payload = stripMongoOperators({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });

    try {
      setIsSubmitting(true);
      // onSubmit é injetado pela página (ver pages/Products.jsx) e chama
      // productsService.createProduct, que efetivamente bate na API.
      await onSubmit?.(payload);
      setForm(INITIAL_STATE);
    } catch (err) {
      setSubmitError(err?.message || 'Não foi possível salvar o produto.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-base font-semibold text-slate-800">Cadastrar produto</h3>

      {submitError && <InlineAlert variant="error" message={submitError} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome do produto" error={errors.name}>
          <input
            type="text"
            maxLength={120}
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Ex.: Fone de Ouvido Bluetooth"
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="SKU" error={errors.sku}>
          <input
            type="text"
            maxLength={32}
            value={form.sku}
            onChange={handleChange('sku')}
            placeholder="Ex.: FONE-BT-001"
            className={inputClass(errors.sku)}
          />
        </Field>

        <Field label="Categoria" error={errors.category}>
          <select
            value={form.category}
            onChange={handleChange('category')}
            className={inputClass(errors.category)}
          >
            <option value="">Selecione...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preço (R$)" error={errors.price}>
          <input
            type="text"
            inputMode="decimal"
            value={form.price}
            onChange={handleChange('price')}
            placeholder="Ex.: 199.90"
            className={inputClass(errors.price)}
          />
        </Field>

        <Field label="Estoque inicial" error={errors.stock}>
          <input
            type="text"
            inputMode="numeric"
            value={form.stock}
            onChange={handleChange('stock')}
            placeholder="Ex.: 50"
            className={inputClass(errors.stock)}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar produto'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/40 ${
    error ? 'border-rose-400' : 'border-slate-300'
  }`;
}
