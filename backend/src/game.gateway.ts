import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Socket, Server } from "socket.io";

interface Room {
  roomId: number;
  p1Id: string;
  p2Id: string;
  p1Score: number;
  p2Score: number;
  p1Ready: boolean;
  p2Ready: boolean;
}

@WebSocketGateway({
  namespace: "/game",
  cors: {
    origin: "*",
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("GameGateway");
  private roomId = 0;
  private rooms: Array<Room> = [];

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.handleJoinRoom(client);
  }

  handleDisconnect(client: Socket) {
    if (this.findCurrentRoom(client.id) !== -1) {
      this.handleUpdateCancel(client);
      this.handleLeaveRoom(client);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  createRoom(): void {
    this.roomId += 1;
    const newRoom: Room = {
      roomId: this.roomId,
      p1Id: "",
      p2Id: "",
      p1Score: 0,
      p2Score: 0,
      p1Ready: false,
      p2Ready: false,
    };
    this.rooms.push(newRoom);
  }

  logRoom(): void {
    for (const room of this.rooms) {
      this.logger.log(
        `Rooms status:
  room ID: ${room.roomId},
  P1 ID: ${room.p1Id},
  P2 ID: ${room.p2Id}`
      );
    }
  }

  findAvailableRoom(): number {
    for (const room of this.rooms) {
      if (room.p1Id === "" || room.p2Id === "") {
        return this.rooms.indexOf(room);
      }
    }
    return -1;
  }

  findCurrentRoom(clientId: string): number {
    for (const room of this.rooms) {
      if (room.p1Id === clientId || room.p2Id === clientId) {
        return this.rooms.indexOf(room);
      }
    }
    return -1;
  }

  isPlayerOne(client: Socket): boolean {
    if (this.rooms[this.findCurrentRoom(client.id)].p1Id === client.id) {
      return true;
    }
    return false;
  }

  @SubscribeMessage("msgToServer")
  handleMessage(client: Socket, message: string): void {
    if (this.rooms[this.findCurrentRoom(client.id)].p1Id === client.id) {
      switch (message) {
        case "u": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit("msgToClient", "u1");
          break;
        }
        case "d": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit("msgToClient", "d1");
          break;
        }
        case "n": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit("msgToClient", "n1");
          break;
        }
      }
    } else {
      switch (message) {
        case "u": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit("msgToClient", "u2");
          break;
        }
        case "d": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit("msgToClient", "d2");
          break;
        }
        case "n": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit("msgToClient", "n2");
          break;
        }
      }
    }
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket): void {
    if (this.rooms.length === 0 || this.findAvailableRoom() === -1) {
      this.createRoom();
      this.rooms[this.rooms.length - 1].p1Id = client.id;
    } else if (this.rooms[this.findAvailableRoom()].p1Id === "") {
      this.rooms[this.findAvailableRoom()].p1Id = client.id;
    } else if (this.rooms[this.findAvailableRoom()].p2Id === "") {
      this.rooms[this.findAvailableRoom()].p2Id = client.id;
    }
    client.join(this.rooms[this.findCurrentRoom(client.id)].roomId.toString());
    this.logger.log(
      `Client ${client.id} joined the room: ${this.rooms[
        this.findCurrentRoom(client.id)
      ].roomId.toString()}`
    );
    this.logRoom();
  }

  @SubscribeMessage("leaveRoom")
  handleLeaveRoom(client: Socket): void {
    this.handleUpdateReady(client, false);
    client.leave(this.rooms[this.findCurrentRoom(client.id)].roomId.toString());
    this.logger.log(
      `Client ${client.id} left the room: ${this.rooms[
        this.findCurrentRoom(client.id)
      ].roomId.toString()}`
    );
    for (const room of this.rooms) {
      if (room.p1Id === client.id) {
        room.p1Id = "";
      } else if (room.p2Id === client.id) {
        room.p2Id = "";
      }
      if (room.p1Id === "" && room.p2Id === "") {
        this.rooms.splice(this.rooms.indexOf(room), 1);
      }
    }
    this.logRoom();
  }

  @SubscribeMessage("updatePlayerPosServer")
  handleUpdatePlayerPos(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
        .emit("updatePlayerPosClient", param);
    }
  }

  @SubscribeMessage("updateBallPosServer")
  handleUpdateBallPos(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
        .emit("updateBallPosClient", param);
    }
  }

  @SubscribeMessage("updateBallDirServer")
  handleUpdateBallDirection(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
        .emit("updateBallDirClient", param);
    }
  }

  @SubscribeMessage("updateScoreServer")
  handleUpdateScore(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
        .emit("updateScoreClient", param);
    }
  }

  @SubscribeMessage("updateReadyServer")
  handleUpdateReady(client: Socket, ready: boolean): void {
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client.id)].p1Ready = ready;
    } else {
      this.rooms[this.findCurrentRoom(client.id)].p2Ready = ready;
    }
    if (
      this.rooms[this.findCurrentRoom(client.id)].p1Ready &&
      this.rooms[this.findCurrentRoom(client.id)].p2Ready
    ) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
        .emit("updateReadyClient", true);
    } else {
      this.server
        .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
        .emit("updateReadyClient", false);
    }
  }

  @SubscribeMessage("updateCancelServer")
  handleUpdateCancel(client: Socket): void {
    this.server
      .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
      .emit("updateCancelClient");
  }

  //   @SubscribeMessage('updateReadyServer')
  //   handleUpdateReady(client: Socket, ready: boolean): void {
  //     if (this.isPlayerOne(client)) {
  //       this.rooms[this.findCurrentRoom(client.id)].p1Ready = ready;
  //     } else {
  //       this.rooms[this.findCurrentRoom(client.id)].p2Ready = ready;
  //     }
  //     this.server
  //       .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
  //       .emit('updateReadyClient', {
  //         p1Ready: this.rooms[this.findCurrentRoom(client.id)].p1Ready,
  //         p2Ready: this.rooms[this.findCurrentRoom(client.id)].p2Ready,
  //       });
  //   }
}
