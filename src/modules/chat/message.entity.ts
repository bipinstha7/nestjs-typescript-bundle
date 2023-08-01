import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from '../user/user.entity';

@Entity()
export default class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public content: string;

  @ManyToOne(() => User)
  public author: User;
}
