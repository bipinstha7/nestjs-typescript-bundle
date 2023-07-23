import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from '../post/post.entity';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.catergories)
  public posts: Post[];
}
