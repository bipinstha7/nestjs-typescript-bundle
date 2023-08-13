import {
  Inject,
  Injectable,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User as PrismaUser } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import Post from './post.entity';
import User from '../user/user.entity';
import constants from 'src/utils/constants';
import { IPost } from './interface/post.interface';
import PostSearchService from './post-search.service';
import PrismaService from 'src/prisma/prisma.service';
import { User as MongooseUser } from '../user/user.model';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { GET_POSTS_CACHE_KEY } from './postCacheKey.constant';
import { Post as MongoosePost, PostDocument } from './post.model';

@Injectable()
export default class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private readonly postSearchService: PostSearchService,
    private readonly prismaService: PrismaService,

    /* Using the cache store manually */
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectModel(MongoosePost.name) private postModel: Model<PostDocument>,
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

  async getPrismaPosts() {
    return this.prismaService.post.findMany();
  }

  async getPostByPrismaId(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
    });

    if (!post) throw new HttpException('Post Not found', HttpStatus.NOT_FOUND);

    return post;
  }

  async createPrismaPost(post: CreatePostDto, user: PrismaUser) {
    const categories = post.categoryIds?.map(category => ({ id: category }));

    return this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
        author: { connect: { id: user.id } },
        categories: { connect: categories },
      },
      include: { categories: true }, // returns whole category object instead of only category id
    });
  }

  async updatePrismaPost(id: number, post: UpdatePostDto) {
    try {
      return await this.prismaService.post.update({
        data: { ...post, id: undefined },
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === constants.PRISMA_RECORD_NOT_EXIST
      ) {
        throw new HttpException('Post Not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async deletePrismaPost(id: number) {
    try {
      return this.prismaService.post.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === constants.PRISMA_RECORD_NOT_EXIST
      ) {
        throw new HttpException('Post Not found', HttpStatus.NOT_FOUND);
      }

      throw error;
    }
  }

  async findAllMongoose() {
    return this.postModel.find().populate('author');
  }

  async findOneMongoose(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException();

    return post;
  }

  async createMongoose(postData: CreatePostDto, author: MongooseUser) {
    return (await this.postModel.create({ ...postData, author })).populate(
      'categories',
    );
  }

  async deleteMany(
    ids: string[],
    session: mongoose.ClientSession | null = null,
  ) {
    return this.postModel.deleteMany({ _id: ids }).session(session);
  }
}
