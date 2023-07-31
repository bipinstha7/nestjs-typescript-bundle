import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import Comment from '../comment.entity';
import CreateCommentCommand from './createComment.command';

@CommandHandler(CreateCommentCommand)
export default class CreateCommentHandler implements ICommandHandler {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand): Promise<any> {
    const newPost = await this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });

    await this.commentRepository.save(newPost);
    return newPost;
  }
}
