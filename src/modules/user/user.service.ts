import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import User from './entity/user.entity';
import { CreateUserDto } from './user.dto';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) return user;

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findBy(id: number, tokenKey: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id, tokenKey } });
    if (user) return user;

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async addTokenKey(id: number, tokenKey: string): Promise<void> {
    await this.userRepository.update({ id }, { tokenKey });
  }

  async clearTokenKey(id: number): Promise<void> {
    await this.userRepository.update({ id }, { tokenKey: '' });
  }
}
