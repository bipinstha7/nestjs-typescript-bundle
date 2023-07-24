import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import AuthGuard from '../auth/auth.guard';
import CategoryService from './category.service';
import { IdParams } from '../../utils/validations';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param() { id }: IdParams) {
    return this.categoryService.getCategoryById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoryService.createCategory(category);
  }

  @Patch(':id')
  async updateCategory(
    @Param() { id }: IdParams,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(Number(id), category);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: IdParams) {
    return this.categoryService.deleteCategory(Number(id));
  }
}
