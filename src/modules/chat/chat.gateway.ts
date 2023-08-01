/* The first step in working with WebSockets in NestJS is creating a gateway. Its job is to receive and send messages. */

import {
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import ChatService from './chat.service';

@WebSocketGateway()
export default class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, author);

    this.server.sockets.emit('receive_message', { content, author });

    return message;
  }

  async handleConnection(socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    await this.chatService.getUserFromSocket(socket);
    const messages = await this.chatService.getAllMessages();

    socket.emit('send_all_messages', messages);
  }
}
