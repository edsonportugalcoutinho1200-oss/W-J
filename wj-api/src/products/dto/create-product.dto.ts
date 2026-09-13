import { IsNumber, IsOptional, IsString, IsUrl, Min, MinLength, MaxLength } from 'class-validator';

/**
 * Este é o "portão de entrada" dos dados — o mesmo papel que
 * utils/sanitize.js cumpre no frontend, mas do lado que realmente importa
 * para segurança: nenhum dado chega ao Mongoose sem passar por aqui
 * primeiro (o ValidationPipe global em main.ts garante isso).
 *
 * Combinado com `whitelist: true` no ValidationPipe, qualquer campo que
 * não esteja declarado aqui é automaticamente descartado antes de chegar
 * no banco — é a versão "de verdade" do que o `stripMongoOperators` do
 * frontend só consegue fazer como reforço, nunca como garantia.
 */
export class CreateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(32)
  sku: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
