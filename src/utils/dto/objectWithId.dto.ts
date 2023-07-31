import { IsNumber } from 'class-validator';

export default class ObjectWithIdDTO {
  @IsNumber()
  id: number;
}
