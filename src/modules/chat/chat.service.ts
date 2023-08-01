import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';

import Message from './message.entity';
import User from '../user/user.entity';
import AuthService from '../auth/auth.service';

@Injectable()
export default class ChatService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authToken } = parse(cookie);

    const user = await this.authService.getUserFromAuthToken(authToken);

    if (!user) throw new WsException('Invalid Credentials');

    return user;
  }

  async saveMessage(content: string, author: User) {
    const newMessage = await this.messageRepository.create({ content, author });
    await this.messageRepository.save(newMessage);

    return newMessage;
  }

  async getAllMessages() {
    return this.messageRepository.find({ relations: ['author'] });
  }
}
