import {
  Index,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import User from '../user/user.entity';
import Comment from '../comment/comment.entity';
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

  @Column('text', { array: true })
  @IsString({ each: true })
  public paragraphs: string[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  public comments: Comment[];
}
