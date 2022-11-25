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
  private userRooms: Map<string, string[]>
  @WebSocketServer() public server: Server;

  constructor() {
    this.userSockets = new Map<Socket, string>
    this.userRooms = new Map<string, string[]>
  }

  getLogin(socket: Socket) {
    return ("cdine")
  }

  handleConnection(socket: Socket) {
    socket.join('connectedUserPool')
  }
  @SubscribeMessage('initTable')
  handleInitTable(socket: Socket, login: string) {
    this.userSockets.set(socket, login)
    this.userRooms.set(login, ["connectedUserPool"])
  }

  handleDisconnect(socket: Socket) {
    let login = this.userSockets.get(socket)

      this.userRooms.get(login)?.forEach(
        (room) => socket.leave(room)
      )
    this.userRooms.delete(login)
    this.userSockets.delete(socket)
  }

  @SubscribeMessage('newChan')
  handleNewChannel(socket: Socket, chan: any) : void {
    let login = this.userSockets.get(socket)

    socket.join("chat" + chan.id);
    this.userRooms.get(login).push("chat" + chan.id)
    if (chan.type === "dm"){}
    else
      this.server.to('connectedUserPool').emit('newChan', chan)
  }

  @SubscribeMessage('newMsg')
  handleNewMessage(client: Socket, message: {room: string, message: any}) : void {
    // check if user not MUTE
    this.server.to('connectedUserPool').emit("newMsg", message.message)
  }

  @SubscribeMessage('leaveChatRoom')
  handleLeaveRoom(socket: Socket, chanID: string): void {
    let login = this.userSockets.get(socket)

    socket.leave("chat" + chanID);
    for (let i = 0; i < this.userRooms[login].length(); i++) {
      if (this.userRooms[login][i] === "chat" + chanID) {
        this.userRooms[login].splice(i, 1)
        break ;
      }
    }
    // remove member from chan members (BAN)
  }
}