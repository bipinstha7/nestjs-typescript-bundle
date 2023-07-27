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

  async getAllPosts(
    offset?: number,
    limit?: number,
  ): Promise<{ items: IPost[]; count: number }> {
    const [items, count] = await this.postRepository.findAndCount({
      relations: ['author'],
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
    });

    return { items, count };
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

  async searchPosts(text: string, offset?: number, limit?: number) {
    const { result, count } = await this.postSearchService.search(
      text,
      offset,
      limit,
    );
    const ids = result.map(result => result.id);

    if (!ids.length) return { items: [], count };
    const items = await this.postRepository.find({ where: { id: In(ids) } });

    return { items, count };
  }

  async searchPostsWithParagraph(paragraph: string) {
    return this.postRepository.query(
      `SELECT * FROM post WHERE $1 = ANY(paragraphs)`,
      [paragraph],
    );
  }
}
