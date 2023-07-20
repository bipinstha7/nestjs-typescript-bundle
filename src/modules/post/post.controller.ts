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
import { Post as IPost } from './post.interface';

@Controller('posts')
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts(): IPost[] {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): IPost {
    return this.postService.getPostById(Number(id));
  }

  @Post()
  createPost(@Body() post: CreatePostDto): IPost {
    return this.postService.createPost(post);
  }

  @Put(':id')
  replacePost(@Param('id') id: string, @Body() post: UpdatePostDto): IPost {
    return this.postService.replacePost(Number(id), post);
  }

  @Delete('id')
  deletePost(@Param('id') id: string): void {
    this.postService.deletePost(Number(id));
  }
}
