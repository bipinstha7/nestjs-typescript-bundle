import { Request } from 'express';
import User from '../user/entity/user.entity';

export interface ITokenPayload {
  userId: number;
  tokenKey: string;
}

export interface IRequestWithUser extends Request {
  user: User;
}
