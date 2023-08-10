import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class StripeEvent {
  @PrimaryColumn()
  public id: string;
}
