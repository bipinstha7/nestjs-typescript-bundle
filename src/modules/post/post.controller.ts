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
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

import Role from '../auth/role.enum';
import PostService from './post.service';
import RoleGuard from '../auth/role.guard';
import { IdParams } from '../../utils/validations';
import { IPost } from './interface/post.interface';
import AuthGuard from '../auth/middleware/auth.guard';
import PermissionGuard from '../auth/permission.guard';
import HttpCacheInterceptor from './httpCache.interceptor';
import { GET_POSTS_CACHE_KEY } from './postCacheKey.constant';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import IPermission from '../auth/interface/permission.interface';
import { IRequestWithUser } from '../auth/interface/auth.interface';
import { PaginationParams } from 'src/utils/dto/paginationParams.dto';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @UseInterceptors(
    HttpCacheInterceptor,
  ) /* Using the cache store Automatically */
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
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

  @Put(
    ':id',
  ) /* Don't need AuthGuard here because it is used/extended in PermissionGuard */
  // @UseGuards(AuthGuard)
  @UseGuards(PermissionGuard(IPermission.UpdatePost))
  updatePost(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
  ): Promise<IPost> {
    return this.postService.updatePost(Number(id), post);
  }

  @Delete('id')
  /* Don't need AuthGuard here because it is used/extended in RoleGuard */
  // @UseGuards(AuthGuard)
  @UseGuards(RoleGuard(Role.Admin))
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(Number(id));
  }
}
