import { NotFoundException } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@WebSocketGateway()
export class UsersGateway {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly usersService: UsersService) {}

  @SubscribeMessage('updateUserInfo')
  async handleUpdateUserInfo(
    @MessageBody() data: { id: string; updateUserDto: UpdateUserDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updatedUser = await this.usersService.update(
        data.id,
        data.updateUserDto,
      );
      this.server.emit('userInfoUpdated', updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        client.emit('error', { message: error.message });
      } else {
        client.emit('error', { message: 'Internal server error' });
      }
    }
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody()
    data: {
      fromUserId: string;
      toUserId: string;
      message: string;
    },
  ) {
    this.server.to(data.toUserId).emit('messageReceived', {
      fromUserId: data.fromUserId,
      message: data.message,
    });
    return {
      event: 'messageReceived',
      data: {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        message: data.message,
      },
    };
  }
}
