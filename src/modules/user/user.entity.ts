import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  /**
   * jwt_token/cookie has the expiration time of 24 hour and after that time it automatically invalidates.
   * if user logs out then the token/cookie also cleared from the browser and should be logged in for the next request
   * but if somehow that token/cookie acquired by hacker then the hacker can call the endpoint on the behalf of the user.
   * To prevent this issue, here we have tokenKey which is regenerated after every login and gets cleared after logout.
   * And on getting the guarded endpoint, this tokenKey is checked.
   */
}
