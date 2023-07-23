import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import Category from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export default class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getAllCategories() {
    return this.categoryRepository.find({ relations: ['posts'] });
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (category) return category;

    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  async createCategory(category: CreateCategoryDto) {
    const newCategory = await this.categoryRepository.create(category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    await this.categoryRepository.update(id, category);
    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (updatedCategory) return updatedCategory;

    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  async deleteCategory(id: number) {
    const deleteResponse = await this.categoryRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
