import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { SocketService } from '../socket/socket.service';
import { Channels } from '../database/channels.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private socketService: SocketService) {}

  @WebSocketServer() public server: Server;

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Channels): Promise<void>    {
    // handles message from clients
  }

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  handleDisconnect(client: Socket) {
    // handles disconnexion client
  }

  handleConnection(client: Socket, ...args: any[]) {
    // handles connexion client ?
  }

  @SubscribeMessage('joinChatRoom')
  JoinRoomSocket(client: Socket, room: string): void {
    // add member to chan
    client.join(room);
  }

  @SubscribeMessage('leaveChatRoom')
  leaveRoomSocket(client: Socket, room: string): void {
    // remove member to chan
    client.leave(room);
  }

  @SubscribeMessage('addNewMsg')
  addNewMessage(client: Socket, room: string): void {
    // add msg
    // emit to room
  }
}