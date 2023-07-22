import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import Post from './post.entity';
import { IPost } from './post.interface';
import { CreatePostDto, UpdatePostDto } from './post.dto';

@Injectable()
export default class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  getAllPosts(): Promise<IPost[]> {
    return this.postRepository.find();
  }

  async getPostById(id: number): Promise<IPost> {
    const post: IPost = await this.postRepository.findOneBy({ id });
    if (post) return post;

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto): Promise<IPost> {
    const newPost = await this.postRepository.create(post);
    await this.postRepository.save(newPost);

    return newPost;
  }

  async replacePost(id: number, post: UpdatePostDto): Promise<IPost> {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOneBy({ id });
    if (updatedPost) return updatedPost;

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number): Promise<void> {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
