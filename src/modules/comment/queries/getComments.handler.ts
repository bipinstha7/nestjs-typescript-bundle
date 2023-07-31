import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

import Comment from '../comment.entity';
import GetCommentsQuery from './getComments.query';

@QueryHandler(GetCommentsQuery)
export default class GetCommentsHandler
  implements IQueryHandler<GetCommentsQuery>
{
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async execute(query: GetCommentsQuery): Promise<any> {
    if (query.postId) {
      return this.commentRepository.findBy({
        post: {
          id: query.postId,
        },
      });
    }
    return this.commentRepository.find();
  }
}
