import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { City } from './constants/product.enum';
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

  // searches from product title and description
  async search(value: string) {
    value = value.toLowerCase();
    return await this.productRepository
      .createQueryBuilder('product')
      .where('lower(product.title) like :title', {
        title: `%${value}%`,
      })
      .orWhere('lower(product.description) like :title', {
        title: `%${value}%`,
      })
      .getMany();
  }

  async filter(categoryId: number, city: any, min = 1, max = Infinity) {
    if (!min) min = 1;
    if (!max) max = Infinity;
    if (city) city = city.toLowerCase();
    else city = City.ALL;
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId: categoryId })
      .andWhere('product.price between :min and :max', { min: min, max: max })
      .andWhere(city === City.ALL ? 'true' : 'product.city like :city', {
        city: `%${city}%`,
      })
      .innerJoinAndSelect('product.category', 'category')
      .getMany();
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await this.productRepository.delete(id);
  }
}
