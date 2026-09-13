import * as mongoose from 'mongoose';

// Molde de como um Produto deve ser salvo no seu e-commerce
const produtoSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  preco: { 
    type: Number, 
    required: true // O preço é obrigatório
  },
  descricao: { 
    type: String 
  },
  emEstoque: { 
    type: Boolean, 
    default: true // Por padrão, entra como disponível
  },
  dataCadastro: { 
    type: Date, 
    default: Date.now 
  }
});

export const Produto = mongoose.model('Produto', produtoSchema);