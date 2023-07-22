import User from './user.entity';

export interface ILogin {
  cookie: string;
  user: Omit<User, 'password' | 'tokenKey'>;
}
