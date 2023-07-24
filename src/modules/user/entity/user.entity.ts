import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import Address from './address.entity';
import Post from '../../post/post.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column()
  @Exclude()
  public tokenKey: string;

  // cascade − Target entity object gets inserted or updated while the source entity object is inserted or updated
  //If we want our related entities always to be included, we can make our relationship eager.
  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
}
