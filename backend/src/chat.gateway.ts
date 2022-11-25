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
  namespace: '/chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
  }

  handleConnection(client: Socket) {
    client.join('connectedUserPool')
  }

  handleDisconnect(client: Socket) {
    client.leave('connectedUserPool')
  }

  @SubscribeMessage('newChan')
  handleNewChannel(client: Socket, chan: any) : void {
    client.join("chat" + chan.id);
    if (chan.type === "dm"){}
    else
      this.server.to('connectedUserPool').emit('newChan', chan)
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, message: {room: string, message: string}) : void {
    // check if user not MUTE
    this.server.to(message.room).emit('chatToClient', message.message)
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(client: Socket, chanID: string): void {
    client.leave("chat" + chanID);
    // remove member from chan members (BAN)
  }
}