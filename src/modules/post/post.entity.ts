import {
  Column,
  Entity,
  ManyToOne,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Transform } from 'class-transformer';

import User from '../user/user.entity';
import Category from '../category/category.entity';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ nullable: true })
  @Transform(({ value }) => {
    if (value !== null) return value;
  })
  public category?: string;

  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category)
  @JoinTable()
  public catergories: Category[];
}
