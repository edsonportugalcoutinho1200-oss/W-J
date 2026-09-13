import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Contrato do Produto — precisa bater EXATAMENTE com o que o frontend já
 * espera (ver src/services/productsService.js e src/components/Products/*
 * no projeto backoffice-ecommerce, e a tabela no README deste projeto):
 *
 *   Product = { id, name, sku, category, price, stock, imageUrl }
 *
 * Por isso os nomes dos campos aqui são em inglês, não em português —
 * não é estética, é o contrato que o frontend já foi construído em cima.
 *
 * NUNCA registre o model direto com `mongoose.model('Produto', schema)`
 * fora do NestJS: chamar isso no escopo do módulo faz o registro rodar de
 * novo a cada reload do `--watch`, e o Mongoose lança
 * "Cannot overwrite model once compiled". Usar `@Schema()`/`@Prop()` +
 * `MongooseModule.forFeature(...)` (ver products.module.ts) deixa o
 * NestJS controlar esse ciclo de vida corretamente.
 */
export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true, // adiciona createdAt/updatedAt automaticamente
  toJSON: {
    virtuals: true,
    // O frontend espera `id` (string), não o `_id`/`__v` padrão do Mongo.
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Product {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 120 })
  name: string;

  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  sku: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop({ trim: true })
  imageUrl?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
