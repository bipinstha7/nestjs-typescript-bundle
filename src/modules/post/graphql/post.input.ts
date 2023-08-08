import { Field, InputType } from '@nestjs/graphql';

@InputType()
export default class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [String])
  paragraphs: string[];
}
