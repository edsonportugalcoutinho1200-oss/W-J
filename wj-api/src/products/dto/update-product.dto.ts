import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * PartialType pega o CreateProductDto e torna todo campo opcional — é
 * exatamente o que um PATCH precisa (o cliente manda só o que quer
 * mudar), sem duplicar as mesmas regras de validação em dois lugares.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
