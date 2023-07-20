import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.interface';

@Injectable()
export default class PostService {
  private lastPostId = 0;
  private posts: Post[] = [];
  getAllPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: number): Post {
    const post = this.posts.find((post) => post.id === id);
    if (post) return post;

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  createPost(post: CreatePostDto): Post {
    const newPost = {
      id: ++this.lastPostId,
      ...post,
    };

    this.posts.push(newPost);

    return newPost;
  }

  replacePost(id: number, post: UpdatePostDto): Post {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > 1) {
      this.posts[postIndex] = post;
      return post;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  deletePost(id: number): void {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > -1) this.posts.splice(postIndex, 1);

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
