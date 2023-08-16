import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import Role from '../auth/role.enum';
import Address from './address.entity';
import Post from '../post/post.entity';
import DatabaseFile from '../upload/file.entity';
import LocalFile from '../upload/localFile.entity';
import PublicFile from '../upload/pulicFile.entity';
import PrivateFile from '../upload/privateFile.entity';
import IPermission from '../auth/interface/permission.interface';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

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
  public posts?: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  public avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files?: PrivateFile[];

  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthEnabled: boolean;

  @Column()
  public stripeCustomerId: string;

  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;

  @Column()
  public phoneNumber: string;

  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFile, { nullable: true })
  public avatarFile?: DatabaseFile;

  @Column({ nullable: true })
  public avatarId?: number;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => LocalFile, {
    nullable: true,
  })
  public localAvatar?: LocalFile;

  @Column({
    type: 'enum',
    array: true,
    default: [Role.User],
  })
  public roles: Role[];

  @Column({
    type: 'enum',
    array: true,
    default: [],
  })
  public permissions: IPermission[];
}
