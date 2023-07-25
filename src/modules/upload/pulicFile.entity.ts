import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export default class PublicFile{
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string

  @Column()
  public key: string
}