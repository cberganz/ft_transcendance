import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket, Server } from 'socket.io';
  
  interface userProfile {
    id: number,
    login?: string,
    username?: string,
    status?: string,
    avatar?: string,
  }
  @WebSocketGateway({
    namespace: '/app',
    cors: {
      origin: "http://localhost:3001",
    },
  })
  export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect
  {
    private usersProfiles: userProfile[]
    private usersSockets: Map<Socket, number>
    constructor() {
      this.usersSockets = new Map<Socket, number>;
      this.usersProfiles = [];
    }

    @WebSocketServer() public server: Server;
    
    handleConnection(socket: Socket) {}
    
    getProfile(id: number) : userProfile {
      for (let profile of this.usersProfiles) {
        if (profile.id === id)
          return profile;
      }
    }

    setProfile(data: {id: number, username?: string, status?: string, avatar?: string}) {
      let newProfile: userProfile;

      for (let i = 0; i < this.usersProfiles.length; i++) {
        if (this.usersProfiles[i].id === data.id) {
          newProfile = {
            id: this.usersProfiles[i].id,
            login: this.usersProfiles[i].login,
            username: data.username !== undefined ? data.username : this.usersProfiles[i].username,
            status: data.status !== undefined ? data.status : this.usersProfiles[i].status,
            avatar: data.avatar !== undefined ? data.avatar : this.usersProfiles[i].avatar,
          }
          this.usersProfiles.splice(i, 1);
          return this.usersProfiles.push(newProfile);
        }
      }
      return this.usersProfiles.push(data);
    }

    @SubscribeMessage('connection')
    handleInitTable(socket: Socket, data: userProfile) {
      this.usersSockets.set(socket, data.id);
      this.setProfile(data);
      this.server.emit("updateStatusFromServer", this.usersProfiles);
    }
    
    // update to anything: online, offline, in game...
    @SubscribeMessage('updateStatus')
    handleUpdateStatus(socket: Socket, status: string) {
      this.setProfile({id: this.usersSockets.get(socket), status: status});
      this.server.emit("updateStatusFromServer", this.usersProfiles);
    }

    @SubscribeMessage('updateUsername')
    handleUpdateUsername(socket: Socket, username: string) {
      this.setProfile({id: this.usersSockets.get(socket), username: username});
      this.server.emit("updateStatusFromServer", this.usersProfiles);
    }
    @SubscribeMessage('updateAvatar')
    handleUpdateAvatar(socket: Socket, avatar: string) {
      this.setProfile({id: this.usersSockets.get(socket), avatar: avatar});
      this.server.emit("updateStatusFromServer", this.usersProfiles);
    }
    
    handleDisconnect(socket: Socket) {
      const userId: number = this.usersSockets.get(socket);
      if (userId !== undefined)
        this.setProfile({id: userId, status: "offline"});
      this.server.emit("updateStatusFromServer", this.usersProfiles);
      this.usersSockets.delete(socket);
    }
  }