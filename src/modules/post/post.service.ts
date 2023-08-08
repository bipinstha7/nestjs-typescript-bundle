import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import Post from './post.entity';
import User from '../user/user.entity';
import { IPost } from './interface/post.interface';
import PostSearchService from './post-search.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { GET_POSTS_CACHE_KEY } from './postCacheKey.constant';

@Injectable()
export default class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly postSearchService: PostSearchService,

    /* Using the cache store manually */
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();

    keys.forEach(key => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }

  async getAllPosts(
    offset?: number,
    limit?: number,
    startId?: number,
    options?: FindManyOptions<Post>,
  ): Promise<{ items: IPost[]; count: number }> {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;

    if (startId) {
      where.id = MoreThan(startId);

      /* TODO: it can be moved to Promise.all */
      separateCount = await this.postRepository.count();
    }

    const [items, count] = await this.postRepository.findAndCount({
      where,
      relations: ['author'],
      order: { id: 'ASC' },
      skip: offset,
      take: limit,
      ...options,
    });

    return { items, count: startId ? separateCount : count };
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
    await this.clearCache();

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
      await this.clearCache();
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
    await this.clearCache();
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

  async getPostsWithAuthors(offset?: number, limit?: number, startId?: number) {
    /* OPTIMIZATION: only join author if user wants the author data */
    return this.getAllPosts(offset, limit, startId, { relations: ['author'] });
  }
}
