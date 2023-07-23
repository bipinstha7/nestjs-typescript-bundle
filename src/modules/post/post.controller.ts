import {
  Req,
  Put,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import PostService from './post.service';
import { IPost } from './post.interface';
import AuthGuard from '../auth/auth.guard';
import { IdParams } from 'src/utils/validations';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { IRequestWithUser } from '../auth/auth.interface';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllPosts(): Promise<IPost[]> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param() { id }: IdParams): Promise<IPost> {
    return this.postService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  createPost(
    @Body() post: CreatePostDto,
    @Req() req: IRequestWithUser,
  ): Promise<IPost> {
    return this.postService.createPost(post, req.user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updatePost(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
  ): Promise<IPost> {
    return this.postService.updatePost(Number(id), post);
  }

  @Delete('id')
  @UseGuards(AuthGuard)
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(Number(id));
  }
}
