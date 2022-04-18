import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: TreeRepository<Category>,
  ) {}

  // creates tree and saves to the db
  async create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.parentId) {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    }

    const parent = await this.categoryRepository.findOne(
      createCategoryDto.parentId,
    );
    const child = this.categoryRepository.create(createCategoryDto);
    child.parent = parent;
    return await this.categoryRepository.save(child);
  }

  // returns all category trees with all nested children
  async findAll() {
    const trees = await this.categoryRepository.findTrees();
    return trees;
  }

  async findOne(id: number, withRelations: boolean) {
    return withRelations
      ? await this.categoryRepository.findOne(id, { relations: ['products'] })
      : await this.categoryRepository.findOne(id);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
