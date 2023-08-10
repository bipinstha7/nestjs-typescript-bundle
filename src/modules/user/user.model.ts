import { Document } from 'mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Address, AddressSchema } from './address.model';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ type: AddressSchema })
  @Type(() => Address)
  address: Address;
}

export const UserSchema = SchemaFactory.createForClass(User);
