import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export default class GetCommentsDto {
  @Type(() => Number)
  @IsOptional()
  postId?: number;
}
