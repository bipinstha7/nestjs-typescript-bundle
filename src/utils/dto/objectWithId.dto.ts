import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export default class ObjectWithIdDTO {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;
}
