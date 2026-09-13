import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.find().sort({ createdAt: -1 }).exec();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    try {
      const created = new this.productModel(dto);
      return await created.save();
    } catch (error: any) {
      // Código 11000 = violação de índice único do Mongo (SKU duplicado).
      // Traduzimos para um 409 claro em vez de deixar o erro cru do driver
      // vazar pro cliente.
      if (error.code === 11000) {
        throw new ConflictException(`Já existe um produto com o SKU "${dto.sku}".`);
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }
  }
}
