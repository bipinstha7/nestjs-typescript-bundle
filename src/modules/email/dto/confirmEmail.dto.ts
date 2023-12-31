import { IsNotEmpty, IsString } from 'class-validator';

export default class ConfirmEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
