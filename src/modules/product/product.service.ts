import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const prod = this.productRepository.create(createProductDto);
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    prod.category = category;
    return await this.productRepository.save(prod);
  }

  async findAll() {
    return await this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id, {
      relations: ['category'],
    });

    if (!product) throw new NotFoundException('Product not found');
    const category = await this.categoryService.findOneAnces(
      product.category.id,
    );
    product.category = category;
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
