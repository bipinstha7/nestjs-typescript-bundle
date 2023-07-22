import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Post from './post.entity';
import PostService from './post.service';
import AuthModule from '../auth/auth.module';
import PostController from './post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export default class PostModule {}
