"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
const mongoose = require("mongoose");
const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    preco: {
        type: Number,
        required: true
    },
    descricao: {
        type: String
    },
    emEstoque: {
        type: Boolean,
        default: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
});
exports.Produto = mongoose.model('Produto', produtoSchema);
//# sourceMappingURL=produto.js.map