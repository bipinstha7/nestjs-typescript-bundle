import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { User } from '../user/user.model';
import { Category } from '../category/category.model';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ index: true })
  title: string;

  @Prop({
    set: (content: string) => {
      return content.trim();
    },
  })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  author: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }],
  })
  @Type(() => Category)
  categories: Category;
}

export const PostSchema = SchemaFactory.createForClass(Post);
