import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common'

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('ChatGateway')

  afterInit(server: Server) {
  }

  handleConnection(client: Socket) {
    client.join('connectedUserPool')
    this.logger.log('New connection')
  }

  handleDisconnect(client: Socket) {
    client.leave('connectedUserPool')
    this.logger.log('New disconnection')
  }

  @SubscribeMessage('newChan')
  handleNewChannel(client: Socket, payload: any) : void {
    this.server.to('connectedUserPool').emit('newChan', payload)
  }

  @SubscribeMessage('sendChatMessage')
  handleSendMessage(client: Socket, message: {room: string, message: string}) : void {
    // check if user not MUTE
    this.server.to(message.room).emit('chatToClient', message.message)
    // add msg to bdd
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    // add member to chan members
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    // remove member from chan members (BAN)
  }
}