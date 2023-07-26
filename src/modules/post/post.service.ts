import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import Post from './post.entity';
import User from '../user/user.entity';
import { IPost } from './interface/post.interface';
import PostSearchService from './post-search.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export default class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly postSearchService: PostSearchService,
  ) {}

  getAllPosts(): Promise<IPost[]> {
    return this.postRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number): Promise<IPost> {
    const post: IPost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (post) return post;

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto, user: User): Promise<IPost> {
    const newPost = await this.postRepository.create({ ...post, author: user });
    await this.postRepository.save(newPost);
    this.postSearchService.indexPost(newPost);

    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto): Promise<IPost> {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      await this.postSearchService.update(updatedPost);
      return updatedPost;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number): Promise<void> {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    await this.postSearchService.remove(id);
  }

  async searchPosts(text: string) {
    const result = await this.postSearchService.search(text);
    const ids = result.map(result => result.id);

    if (!ids.length) return [];
    return this.postRepository.find({ where: { id: In(ids) } });
  }
}
