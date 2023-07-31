import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import ObjectWithIdDTO from 'src/utils/dto/objectWithId.dto';

export default class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDTO)
  post: ObjectWithIdDTO;
}
