import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export default class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;
}
