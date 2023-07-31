import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import Comment from './comment.entity';
import AuthModule from '../auth/auth.module';
import CommentController from './comment.controller';
import GetCommentsHandler from './queries/getComments.handler';
import CreateCommentHandler from './commands/createComment.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule, CqrsModule],
  controllers: [CommentController],
  providers: [CreateCommentHandler, GetCommentsHandler],
})
export default class CommentModule {}
