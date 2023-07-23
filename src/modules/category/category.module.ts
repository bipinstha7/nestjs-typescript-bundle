import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Category from './category.entity';
import AuthModule from '../auth/auth.module';
import CategoryService from './category.service';
import CategoryController from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export default class CategoryModule {}
