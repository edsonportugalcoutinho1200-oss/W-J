import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Rotas batendo com o contrato já documentado e consumido pelo frontend
 * (services/productsService.js no backoffice-ecommerce):
 *   GET    /products
 *   POST   /products
 *   PATCH  /products/:id
 *   DELETE /products/:id
 *
 * ⚠️ SEGURANÇA — pendência conhecida, não esquecida: nenhuma rota aqui
 * tem guard de autenticação ainda. Isso é proposital nesta etapa (Etapa 2
 * do roteiro = só o CRUD) — o guard de JWT/papel (@Roles('ADMIN') em
 * POST/PATCH/DELETE) entra na Etapa 3. Até lá, qualquer pessoa que
 * descobrir esta URL pode criar/editar/remover produtos. Não usar isso
 * como está em produção.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
