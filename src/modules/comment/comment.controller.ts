import {
  Req,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import AuthGuard from '../auth/middleware/auth.guard';
import CreateCommentDto from './dto/createComment.dto.ts';
import { IRequestWithUser } from '../auth/interface/auth.interface';
import CreateCommentCommand from './commands/createComment.command';
import GetCommentsDto from './dto/getComments.dto';
import GetCommentsQuery from './queries/getComments.query';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export default class CommentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Req() req: IRequestWithUser,
  ) {
    const user = req.user;

    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
