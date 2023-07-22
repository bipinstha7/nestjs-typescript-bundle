import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';

import PostService from './post.service';
import { IPost } from './post.interface';
import AuthGuard from '../auth/auth.guard';
import { CreatePostDto, UpdatePostDto } from './post.dto';

@Controller('posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllPosts(): Promise<IPost[]> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Promise<IPost> {
    return this.postService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  createPost(@Body() post: CreatePostDto): Promise<IPost> {
    return this.postService.createPost(post);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  replacePost(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
  ): Promise<IPost> {
    return this.postService.replacePost(Number(id), post);
  }

  @Delete('id')
  @UseGuards(AuthGuard)
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(Number(id));
  }
}