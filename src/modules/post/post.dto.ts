import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  title: string;
  content: string;
}

export class UpdatePostDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  content: string;
}
