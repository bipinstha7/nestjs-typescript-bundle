import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import Post from './post.entity';
import { IPostSearchBody } from './interface/post-search.interface';

@Injectable()
export default class PostSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index<IPostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id,
      },
    });
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }

    const { hits } = await this.elasticsearchService.search<IPostSearchBody>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'content'],
              },
            },
            filter: {
              range: {
                id: { gt: startId },
              },
            },
          },
        },
        sort: {
          id: { order: 'asc' },
        },
      },
    });

    const count = hits.total;
    const result = hits.hits.map(hit => hit._source);

    return { count: startId ? separateCount : count, result };
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async update(post: Post) {
    const newBody: IPostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author.id,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: { id: post.id },
        },
        script: { source: script },
      },
    });
  }

  async count(query: string, fields: string[]) {
    const { count } = await this.elasticsearchService.count({
      index: this.index,
      body: {
        query: {
          multi_match: { query, fields },
        },
      },
    });
    return count;
  }
}
