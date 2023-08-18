import { UseGuards } from '@nestjs/common';
import { Args, Query, Context, Mutation, Resolver } from '@nestjs/graphql';

import Post from './post.model';
import PostService from '../post.service';
import CreatePostInput from './post.input';
import { IRequestWithUser } from '../../auth/interface/auth.interface';
import GraphqlAuthGuard from '../../auth/middleware/auth-graphql.guard';

@Resolver(() => Post)
export default class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  async posts() {
    const posts = await this.postService.getPostsWithAuthors();
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: IRequestWithUser },
  ) {
    return this.postService.createPost(createPostInput, context.req.user);
  }
}
