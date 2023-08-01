import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import Post from './post.entity';
import PostService from './post.service';
import AuthModule from '../auth/auth.module';
import PostController from './post.controller';
import PostSearchService from './post-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    AuthModule,
    SearchModule,
    CacheModule.register(),
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export default class PostModule {}
