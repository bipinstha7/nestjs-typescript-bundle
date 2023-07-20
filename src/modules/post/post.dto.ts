export class CreatePostDto {
  title: string;
  content: string;
}

export class UpdatePostDto {
  id: number;
  title: string;
  content: string;
}
