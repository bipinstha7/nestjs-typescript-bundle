import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Subscriber {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;
}
