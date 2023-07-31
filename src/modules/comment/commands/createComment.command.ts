import User from '../../user/user.entity';
import CreateCommentDto from '../dto/createComment.dto.ts';

export default class CreateCommentCommand {
  constructor(
    public readonly comment: CreateCommentDto,
    public readonly author: User,
  ) {}
}
