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
import { randomUUID } from "crypto";

interface Room {
  roomId: string;
  players: string[];
  spectators: string[];
  ready: boolean[];
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
  private rooms: Array<Room> = [];

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(
      `Client connected: ID ${client.handshake.query.id.toString()}`
    );
    this.reconnectRoom(client);
  }

  handleDisconnect(client: Socket) {
    // this.leaveRoom(client);
    // this.handleUpdateReady(client, false);
    this.logger.log(
      `Client disconnected: ID ${client.handshake.query.id.toString()}`
    );
  }

  joinRoom(client: Socket): void {
    if (this.reconnectRoom(client)) {
      return;
    }
    if (this.rooms.length === 0 || this.findAvailableRoom() === -1) {
      this.createRoom();
      this.rooms[this.rooms.length - 1].players[0] =
        client.handshake.query.id.toString();
    } else if (this.rooms[this.findAvailableRoom()].players[0] === "") {
      this.rooms[this.findAvailableRoom()].players[0] =
        client.handshake.query.id.toString();
    } else if (this.rooms[this.findAvailableRoom()].players[1] === "") {
      this.rooms[this.findAvailableRoom()].players[1] =
        client.handshake.query.id.toString();
    }
    client.join(this.rooms[this.findCurrentRoom(client)].roomId);
    this.logRoom();
  }

  reconnectRoom(client: Socket): boolean {
    if (this.findCurrentRoom(client) !== -1) {
      this.logRoom();
      client.join(this.rooms[this.findCurrentRoom(client)].roomId);
      return true;
    }
    return false;
  }

  leaveRoom(client: Socket): void {
    // this.handleUpdateReady(client, false);
    client.leave(this.rooms[this.findCurrentRoom(client)].roomId);
    this.logger.log(
      `Client ${client.id} left the room: ${
        this.rooms[this.findCurrentRoom(client)].roomId
      }`
    );
    for (const room of this.rooms) {
      if (room.players[0] === client.handshake.query.id.toString()) {
        room.players[0] = "";
      } else if (room.players[1] === client.handshake.query.id.toString()) {
        room.players[1] = "";
      }
      if (room.players[0] === "" && room.players[1] === "") {
        this.rooms.splice(this.rooms.indexOf(room), 1);
      }
    }
    this.logRoom();
  }

  @SubscribeMessage("msgToServer")
  handleMessage(client: Socket, message: string): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (
      this.rooms[this.findCurrentRoom(client)].players[0] ===
      client.handshake.query.id.toString()
    ) {
      switch (message) {
        case "u": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client)].roomId)
            .emit("msgToClient", "u1");
          break;
        }
        case "d": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client)].roomId)
            .emit("msgToClient", "d1");
          break;
        }
        case "n": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client)].roomId)
            .emit("msgToClient", "n1");
          break;
        }
      }
    } else {
      switch (message) {
        case "u": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client)].roomId)
            .emit("msgToClient", "u2");
          break;
        }
        case "d": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client)].roomId)
            .emit("msgToClient", "d2");
          break;
        }
        case "n": {
          this.server
            .to(this.rooms[this.findCurrentRoom(client)].roomId)
            .emit("msgToClient", "n2");
          break;
        }
      }
    }
  }

  @SubscribeMessage("updatePlayerPosServer")
  handleUpdatePlayerPos(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updatePlayerPosClient", param);
    }
  }

  @SubscribeMessage("updateBallPosServer")
  handleUpdateBallPos(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updateBallPosClient", param);
    }
  }

  @SubscribeMessage("updateBallDirServer")
  handleUpdateBallDirection(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updateBallDirClient", param);
    }
  }

  @SubscribeMessage("updateScoreServer")
  handleUpdateScore(client: Socket, param): void {
    if (this.isPlayerOne(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updateScoreClient", param);
    }
  }

  @SubscribeMessage("updateReadyServer")
  handleUpdateReady(client: Socket, ready: boolean): void {
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].ready[0] = ready;
    } else {
      this.rooms[this.findCurrentRoom(client)].ready[1] = ready;
    }
    if (
      this.rooms[this.findCurrentRoom(client)].ready[0] &&
      this.rooms[this.findCurrentRoom(client)].ready[1]
    ) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updateReadyClient", true);
    } else {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updateReadyClient", false);
    }
  }

  @SubscribeMessage("updateCancelServer")
  handleUpdateCancel(client: Socket): void {
    this.server
      .to(this.rooms[this.findCurrentRoom(client)].roomId)
      .emit("updateCancelClient");
  }

  @SubscribeMessage("updateQueueServer")
  handleUpdateQueue(client: Socket, queueStatus: boolean): void {
    this.joinRoom(client);
    if (this.roomIsFull(client)) {
      this.server
        .to(this.rooms[this.findCurrentRoom(client)].roomId)
        .emit("updateQueueClient");
    }
  }

  findAvailableRoom(): number {
    for (const room of this.rooms) {
      if (room.players[0] === "" || room.players[1] === "") {
        return this.rooms.indexOf(room);
      }
    }
    return -1;
  }

  findCurrentRoom(client: Socket): number {
    for (const room of this.rooms) {
      if (
        room.players[0] === client.handshake.query.id.toString() ||
        room.players[1] === client.handshake.query.id.toString()
      ) {
        return this.rooms.indexOf(room);
      }
    }
    return -1;
  }

  createRoom(): void {
    const newRoom: Room = {
      roomId: randomUUID(),
      players: ["", ""],
      spectators: [],
      ready: [false, false],
    };
    this.rooms.push(newRoom);
  }

  logRoom(): void {
    for (const room of this.rooms) {
      this.logger.log(
        `Rooms status:
  room ID: ${room.roomId},
  P1 ID: ${room.players[0]},
  P2 ID: ${room.players[1]}`
      );
    }
  }

  isPlayerOne(client: Socket): boolean {
    if (
      this.rooms[this.findCurrentRoom(client)].players[0] ===
      client.handshake.query.id.toString()
    ) {
      return true;
    }
    return false;
  }

  roomIsFull(client: Socket): boolean {
    if (
      this.rooms[this.findCurrentRoom(client)].players[0] !== "" &&
      this.rooms[this.findCurrentRoom(client)].players[1] !== ""
    ) {
      return true;
    }
    return false;
  }
}
