import { Field, Int, ObjectType } from '@nestjs/graphql';
import User from '../../user/graphql/user.model';

@ObjectType()
export default class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [String])
  paragraphs: string[];

  @Field(() => Int)
  authorId: number;

  @Field()
  author: User;
}
