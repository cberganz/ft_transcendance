import {
  SubscribeMessage,
  WebSocketGateway,
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
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect
{
  private userSockets: Map<Socket, string>
  @WebSocketServer() public server: Server;

  constructor() {
    this.userSockets = new Map<Socket, string>
  }

  handleConnection(socket: Socket) {}

  @SubscribeMessage('initTable')
  handleInitTable(socket: Socket, login: string) {
    this.userSockets.set(socket, login)
  }

  handleDisconnect(socket: Socket) {
    socket.rooms.forEach(
      (room) => socket.leave(room)
    )
    this.userSockets.delete(socket)
  }

  @SubscribeMessage('newChanFromClient')
  handleNewChannel(socket: Socket, chan: any) : void {
    socket.join("chat" + chan.id);
    // add other user socket to room
    if (chan.type === "dm")
      this.server.to("chat" + chan.id).emit('newChanFromServer', chan)
    else
      this.server.emit('newChanFromServer', chan)
  }

  @SubscribeMessage('updateChanFromClient')
  handleUpdateChannel(socket: Socket, chan: any) : void {
    this.server.emit('updateChanFromServer', chan)
  }

  @SubscribeMessage('newMsgFromClient')
  handleNewMessage(socket: Socket, message: {room: string, message: any}) : void {
    // check if user not MUTE
    this.server.to(message.room).emit('newMsgFromServer', message.message)
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinRoom(socket: Socket, chanID: number): void {
    socket.join("chat" + chanID);
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(socket: Socket, chanID: number): void {
    socket.leave("chat" + chanID);
    // remove member from chan members (BAN)
  }
}