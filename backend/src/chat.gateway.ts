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
  private userSockets: Map<string, Socket>
  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
  }

  handleConnection(socket: Socket) {
    socket.join('connectedUserPool')
  }

  handleDisconnect(socket: Socket) {
    socket.leave('connectedUserPool')
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
    this.server.to(message.room).emit('newMsg', message.message)
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(client: Socket, chanID: string): void {
    client.leave("chat" + chanID);
    // remove member from chan members (BAN)
  }
}