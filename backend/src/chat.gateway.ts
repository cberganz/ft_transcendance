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
  async handleNewChannel(socket: Socket, chan: any) {
    socket.join("chat" + chan.id);

    if (chan.type === "dm"){
      let user2;
        
      if (chan.members[0].login === this.userSockets.get(socket))
      user2 = chan.members[1].login;
      else
      user2 = chan.members[0].login;
      for (let [userSocket, login] of this.userSockets) {
        if (login === user2)
          userSocket.join("chat" + chan.id)
      }
    this.server.to("chat" + chan.id).emit('newChanFromServer', chan)
    }
    else {
      let isInChan: boolean;
      let withoutMessageChan = {... chan};
      delete withoutMessageChan.Message;
      
      this.server.to("chat" + chan.id).emit('newChanFromServer', chan)
      for (let [userSocket, login] of this.userSockets) {
        isInChan = false;
        for (let room of userSocket.rooms) {
          if (room === "chat" + chan.id) {
            isInChan = true;
            break ;
          }
        }
        if (!isInChan)
          userSocket.emit('newChanFromServer', withoutMessageChan);
      }
    }
  }

  @SubscribeMessage('updateChanFromClient')
  handleUpdateChannel(socket: Socket, chan: any) : void {
    let isInChan: boolean;
    let withoutMessageChan = {... chan};
    delete withoutMessageChan.Message;
    
    this.server.to("chat" + chan.id).emit('updateChanFromServer', chan)
    for (let [userSocket, login] of this.userSockets) {
      isInChan = false;
      for (let room of userSocket.rooms) {
        if (room === "chat" + chan.id) {
          isInChan = true;
          break ;
        }
      }
      if (!isInChan)
        userSocket.emit('updateChanFromServer', withoutMessageChan);
    }
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

  @SubscribeMessage('updateUserFromClient')
  updateUser(socket: Socket, user: any): void {
    socket.emit('updateUserFromServer', user);
  }

  @SubscribeMessage('updateUserlistFromClient')
  updateUserList(socket: Socket, user: any): void {
    socket.emit('updateUserlistFromServer', user);
  }

  @SubscribeMessage('banFromClient')
  banUser(socket: Socket, data: {bannedLogin: string, chanId: number}): void {
    for (let [userSocket, login] of this.userSockets) {
      if (login === data.bannedLogin) {
        userSocket.leave("chat" + data.chanId);
        break ;
      }
    }
  }
  
}