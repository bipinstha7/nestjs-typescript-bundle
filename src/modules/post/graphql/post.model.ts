import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];
}
