import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { RegisterDto } from './auth.dto';
import User from '../user/entity/user.entity';
import UserService from '../user/user.service';
import { ILogin } from '../user/user.interface';
import { ITokenPayload } from './auth.interface';
import { IJWTConfig } from '../../config/config.interface';
import { PostgresErrorCode } from '../../db/postgreErrorCodes.enum';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<IJWTConfig>,
  ) {}

  async register(
    registrationData: RegisterDto,
  ): Promise<Omit<User, 'password' | 'tokenKey'>> {
    try {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);

      const createdUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
        tokenKey: 'login',
      });

      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(email: string, password: string): Promise<ILogin> {
    try {
      const user = await this.userService.getByEmail(email);
      await this.verifyPassword(password, user.password);

      const tokenKey = 'login';
      const cookie = this.getCookieWithJwtToken(user.id, tokenKey);

      await this.userService.addTokenKey(user.id, tokenKey);

      return { user, cookie };
    } catch (error) {
      throw new HttpException(
        error.message || 'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPasswordMatch) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  getCookieWithJwtToken(userId: number, tokenKey: string): string {
    const payload: ITokenPayload = { userId, tokenKey };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  logout(userId: number): string {
    this.userService.clearTokenKey(userId);

    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
}
