import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Post from './post.entity';
import PostService from './post.service';
import AuthModule from '../auth/auth.module';
import PostController from './post.controller';
import PostSearchService from './post-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule, SearchModule],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export default class PostModule {}
