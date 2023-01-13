import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { loggingMiddleware } from "nestjs-prisma";
import { Socket, Server } from "socket.io";

interface userProfile {
  id: number;
  login?: string;
  username?: string;
  status?: string;
  avatar?: string;
}

interface userPair {
  id1: number;
  id2: number;
}

// interface readyPair {
// 	ready1: boolean,
// 	ready2: boolean
// }

@WebSocketGateway({
  namespace: "/app",
  cors: {
    origin: "http://localhost:3001",
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private usersProfiles: userProfile[];
  private usersSockets: Map<Socket, number>;
  private usersInvited: Map<string, userPair>;
  constructor() {
    this.usersSockets = new Map<Socket, number>();
    this.usersProfiles = [];
    this.usersInvited = new Map<string, userPair>();
  }

  @WebSocketServer() public server: Server;

  handleConnection(socket: Socket) {}

  getProfile(id: number): userProfile {
    for (let profile of this.usersProfiles) {
      if (profile.id === id) return profile;
    }
  }

  setProfile(data: {
    id: number;
    username?: string;
    status?: string;
    avatar?: string;
  }) {
    let newProfile: userProfile;

    for (let i = 0; i < this.usersProfiles.length; i++) {
      if (this.usersProfiles[i].id === data.id) {
        newProfile = {
          id: this.usersProfiles[i].id,
          login: this.usersProfiles[i].login,
          username:
            data.username !== undefined
              ? data.username
              : this.usersProfiles[i].username,
          status:
            data.status !== undefined
              ? data.status
              : this.usersProfiles[i].status,
          avatar:
            data.avatar !== undefined
              ? data.avatar
              : this.usersProfiles[i].avatar,
        };
        this.usersProfiles.splice(i, 1);
        return this.usersProfiles.push(newProfile);
      }
    }
    return this.usersProfiles.push(data);
  }

  @SubscribeMessage("connection")
  handleInitTable(socket: Socket, data: userProfile) {
    this.usersSockets.set(socket, data.id);
    this.setProfile(data);
    this.server.emit("updateStatusFromServer", this.usersProfiles);
    this.server.emit("updateSearchBarUserList", this.usersProfiles);
    // so that socket signal received by search bar doesnt get mixed up as it is rendered everywhere
  }

  // update to anything: online, offline, in game...
  @SubscribeMessage("updateStatus")
  handleUpdateStatus(socket: Socket, status: string) {
    this.setProfile({ id: this.usersSockets.get(socket), status: status });
    this.server.emit("updateStatusFromServer", this.usersProfiles);
    this.server.emit("updateSearchBarUserList", this.usersProfiles);
  }

  @SubscribeMessage("updateUsername")
  handleUpdateUsername(socket: Socket, username: string) {
    this.setProfile({ id: this.usersSockets.get(socket), username: username });
    this.server.emit("updateStatusFromServer", this.usersProfiles);
    this.server.emit("updateSearchBarUserList", this.usersProfiles);
  }
  @SubscribeMessage("updateAvatar")
  handleUpdateAvatar(socket: Socket, avatar: string) {
    this.setProfile({ id: this.usersSockets.get(socket), avatar: avatar });
    this.server.emit("updateStatusFromServer", this.usersProfiles);
    this.server.emit("updateSearchBarUserList", this.usersProfiles);
  }

  @SubscribeMessage("invitePlayer")
  handleInvitePlayer(socket: Socket, invitedPlayerId: number) {
    for (let [sock, id] of this.usersSockets) {
      if (id === invitedPlayerId) {
        this.server.to(sock.id).emit("invitePlayerClient"); // check si le user est pas deja dans une invite
        this.usersInvited.set(randomUUID(), {
          id1: this.usersSockets.get(socket),
          id2: id,
        });
      }
    }
  }

  @SubscribeMessage("acceptInvitationServer")
  handleAcceptInvitation(socket: Socket) {
    const socketId = this.usersSockets.get(socket);
    for (let [id, pair] of this.usersInvited) {
      if (pair.id1 === socketId || pair.id2 === socketId) {
        for (let [sock, sockId] of this.usersSockets) {
          if (sockId === pair.id1 || sockId === pair.id2) {
            this.server.to(sock.id).emit("invitationGameClient", id);
          }
        }
      }
    }
  }

  @SubscribeMessage("deleteInvitation")
  handleDeleteInvitation(socket: Socket) {
    const socketId = this.usersSockets.get(socket);
    for (let [id, pair] of this.usersInvited) {
      if (pair.id1 === socketId || pair.id2 === socketId) {
        this.usersInvited.delete(id);
      }
    }
  }

  @SubscribeMessage("spectatePlayer")
  handleSpectatePlayer(socket: Socket, playerIdToSpectate: number) {
    const socketId = this.usersSockets.get(socket);
    for (let [sock, sockId] of this.usersSockets) {
      if (sockId === socketId) {
        this.server
          .to(sock.id)
          .emit("spectateGameClient", playerIdToSpectate.toString());
      }
    }
  }

  handleDisconnect(socket: Socket) {
    const userId: number = this.usersSockets.get(socket);
    if (userId !== undefined)
      this.setProfile({ id: userId, status: "offline" });
    this.server.emit("updateStatusFromServer", this.usersProfiles);
    this.server.emit("updateSearchBarUserList", this.usersProfiles);
    this.usersSockets.delete(socket);
  }
}
