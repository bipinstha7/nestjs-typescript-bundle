import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import PostService from './post.service';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { IPost } from './post.interface';

@Controller('posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts(): Promise<IPost[]> {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): Promise<IPost> {
    return this.postService.getPostById(Number(id));
  }

  @Post()
  createPost(@Body() post: CreatePostDto): Promise<IPost> {
    return this.postService.createPost(post);
  }

  @Put(':id')
  replacePost(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
  ): Promise<IPost> {
    return this.postService.replacePost(Number(id), post);
  }

  @Delete('id')
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(Number(id));
  }
}
