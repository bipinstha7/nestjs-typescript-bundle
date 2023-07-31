import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import Post from '../post/post.entity';
import User from '../user/user.entity';

@Entity()
export default class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => Post, (post: Post) => post.comments)
  public post: Post;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;
}
