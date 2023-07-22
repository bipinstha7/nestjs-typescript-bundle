import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Post from './post.entity';
import PostService from './post.service';
import PostController from './post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService],
})
export default class PostModule {}
