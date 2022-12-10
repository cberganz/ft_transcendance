import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  
  @WebSocketGateway({
    namespace: '/app',
    cors: {
      origin: '*',
    },
  })
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect
  {
    private usersStatus: Map<number, string>
    private usersSockets: Map<Socket, number>
    constructor() {
      this.usersSockets = new Map<Socket, number>;
      this.usersStatus = new Map<number, string>;
    }

    @WebSocketServer() public server: Server;
    
    handleConnection(socket: Socket) {}
    
    @SubscribeMessage('connection')
    handleInitTable(socket: Socket, id: number) {
      this.usersSockets.set(socket, id);
      if (this.usersStatus.get(id) === undefined)
        this.server.emit("newUserFromServer");
      this.usersStatus.set(id, "online");
      this.server.emit("updateStatusFromServer", JSON.stringify(Array.from(this.usersStatus)));
    }
    
    // update to anything: online, offline, in game...
    @SubscribeMessage('updateStatus')
    handleUpdateStatus(socket: Socket, status: string) {
      this.usersStatus.set(this.usersSockets.get(socket), status);
      this.server.emit("updateStatusFromServer", JSON.stringify(Array.from(this.usersStatus)));
    }
    
    handleDisconnect(socket: Socket) {
      const userId: number = this.usersSockets.get(socket);
      if (userId !== undefined)
        this.usersStatus.set(userId, "offline");
      this.server.emit("updateStatusFromServer", JSON.stringify(Array.from(this.usersStatus)));
      this.usersSockets.delete(socket);
    }
  }