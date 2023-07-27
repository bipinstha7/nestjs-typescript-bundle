import {
  Req,
  Put,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import PostService from './post.service';
import { IdParams } from '../../utils/validations';
import { IPost } from './interface/post.interface';
import AuthGuard from '../auth/middleware/auth.guard';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { IRequestWithUser } from '../auth/interface/auth.interface';
import { PaginationParams } from 'src/utils/dto/paginationParams.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseGuards(AuthGuard)
  getPosts(
    @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams,
  ) {
    if (search) {
      return this.postService.searchPosts(search, offset, limit);
    }
    return this.postService.getAllPosts(offset, limit);
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
