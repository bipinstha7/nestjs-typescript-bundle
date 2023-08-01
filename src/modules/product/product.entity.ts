import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import ICarProperties from './interface/carProperties.interface';
import IBookProperties from './interface/bookProperties.interface';

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ type: 'jsonb' })
  public properties: ICarProperties | IBookProperties;
}
