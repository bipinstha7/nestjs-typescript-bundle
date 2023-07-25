import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../user/entity/user.entity';

@Entity()
export default class PrivateFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public key: string;

  @ManyToOne(() => User, (owner: User) => owner.files)
  public owner: User;
}
