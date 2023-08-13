import { Document } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Post } from '../post/post.model';
import { Address, AddressSchema } from './address.model';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ type: AddressSchema })
  @Type(() => Address)
  address: Address;

  @Prop({
    get: (creditCardNumber: string) => {
      if (!creditCardNumber) return;
      const lastFourDigits = creditCardNumber.slice(
        creditCardNumber.length - 4,
      );

      return `****-****-****-${lastFourDigits}`;
    },
  })
  creditCardNumber?: string;

  @Type(() => Post)
  posts: Post[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName')
  .get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (this: UserDocument, fullName: string) {
    const [firstName, lastName] = fullName.split(' ');
    this.set({ firstName, lastName });
  });

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

export { UserSchema };
