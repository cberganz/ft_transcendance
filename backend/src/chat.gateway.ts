import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
  }

  handleDisconnect(client: Socket) {
  }

  handleConnection(client: Socket, ...args: any[]) {
  }

  @SubscribeMessage('sendChatMessage')
  handleSendMessage(client: Socket, room: string, message: string) : void {
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
}