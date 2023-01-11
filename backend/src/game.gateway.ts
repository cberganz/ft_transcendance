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
  pause: boolean[];
  playerPosition: number[];
  ballPosition: number[];
  ballDirection: number[];
  score: number[];
  custom: boolean[];
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
      `Client connected: ID ${client.handshake.auth.id.toString()}`
    );
    this.reconnectRoom(client);
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].pause[0] = false;
    } else {
      this.rooms[this.findCurrentRoom(client)].pause[1] = false;
    }
    this.rejoinGame(client);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client disconnected: ID ${client.handshake.auth.id.toString()}`
    );
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].pause[0] = true;
    } else {
      this.rooms[this.findCurrentRoom(client)].pause[1] = true;
    }
  }

  joinRoom(client: Socket): void {
    if (this.reconnectRoom(client)) {
      return;
    }
    if (this.rooms.length === 0 || this.findAvailableRoom() === -1) {
      this.createRoom(client);
      this.rooms[this.rooms.length - 1].players[0] =
        client.handshake.auth.id.toString();
    } else if (this.rooms[this.findAvailableRoom()].players[0] === "") {
      this.rooms[this.findAvailableRoom()].players[0] =
        client.handshake.auth.id.toString();
    } else if (this.rooms[this.findAvailableRoom()].players[1] === "") {
      this.rooms[this.findAvailableRoom()].players[1] =
        client.handshake.auth.id.toString();
    }
    client.join(this.roomId(client));
    this.logRoom();
  }

  reconnectRoom(client: Socket): boolean {
    if (this.findCurrentRoom(client) !== -1) {
      this.logRoom();
      client.join(this.roomId(client));
      if (!this.roomIsFull(client)) {
        this.server.to(this.roomId(client)).emit("reconnectQueueClient");
      } else if (this.isPlayerOne(client)) {
        if (this.roomReady(client)[0] && this.roomReady(client)[1]) {
          this.server.to(client.id).emit("reconnectReadyClient");
        } else if (this.roomReady(client)[0]) {
          this.server.to(client.id).emit("reconnectStartClient");
        } else {
          this.server.to(client.id).emit("reconnectNotStartClient");
        }
        this.server
          .to(client.id)
          .emit("reconnectCustomClient", this.roomCustom(client)[0]);
      } else {
        if (this.roomReady(client)[0] && this.roomReady(client)[1]) {
          this.server.to(client.id).emit("reconnectReadyClient");
        } else if (this.roomReady(client)[1]) {
          this.server.to(client.id).emit("reconnectStartClient");
        } else {
          this.server.to(client.id).emit("reconnectNotStartClient");
        }
        this.server
          .to(client.id)
          .emit("reconnectCustomClient", this.roomCustom(client)[1]);
      }
      return true;
    }
    return false;
  }

  rejoinGame(client: Socket): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    const playerPosition: Array<number> = [...this.roomPlayerPosition(client)];
    const ballPosition: Array<number> = [...this.roomBallPosition(client)];
    const ballDirection: Array<number> = [...this.roomBallDirection(client)];
    const score: Array<number> = [...this.roomScore(client)];
    if (ballPosition[0] === undefined) {
      return;
    }
    if (playerPosition[0] !== undefined) {
      this.server
        .to(this.roomId(client))
        .emit("updatePlayerPosClient", { pos: playerPosition[0], id: 1 });
    }
    if (playerPosition[1] !== undefined) {
      this.server
        .to(this.roomId(client))
        .emit("updatePlayerPosClient", { pos: playerPosition[1], id: 2 });
    }
    this.server.to(this.roomId(client)).emit("updateBallPosClient", {
      posX: ballPosition[0],
      posY: ballPosition[1],
    });
    this.server
      .to(this.roomId(client))
      .emit("updateBallDirClient", ballDirection);
    this.server
      .to(this.roomId(client))
      .emit("updateScoreClient", { playerNumber: 1, score: score[0] });
    this.server
      .to(this.roomId(client))
      .emit("updateScoreClient", { playerNumber: 2, score: score[1] });
    this.server.to(this.roomId(client)).emit("updateAlreadyStarted");
  }

  leaveRoom(client: Socket): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    client.leave(this.roomId(client));
    for (const room of this.rooms) {
      if (
        room.players[0] === client.handshake.auth.id.toString() ||
        room.players[1] === client.handshake.auth.id.toString()
      ) {
        this.rooms.splice(this.rooms.indexOf(room), 1);
      }
    }
    this.logRoom();
  }

  @SubscribeMessage("updateDirectionServer")
  handleMessage(client: Socket, message: string): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.roomPause(client)) {
      return;
    }
    if (
      this.rooms[this.findCurrentRoom(client)].players[0] ===
      client.handshake.auth.id.toString()
    ) {
      switch (message) {
        case "u": {
          this.server
            .to(this.roomId(client))
            .emit("updateDirectionClient", "u1");
          break;
        }
        case "d": {
          this.server
            .to(this.roomId(client))
            .emit("updateDirectionClient", "d1");
          break;
        }
        case "n": {
          this.server
            .to(this.roomId(client))
            .emit("updateDirectionClient", "n1");
          break;
        }
      }
    } else {
      switch (message) {
        case "u": {
          this.server
            .to(this.roomId(client))
            .emit("updateDirectionClient", "u2");
          break;
        }
        case "d": {
          this.server
            .to(this.roomId(client))
            .emit("updateDirectionClient", "d2");
          break;
        }
        case "n": {
          this.server
            .to(this.roomId(client))
            .emit("updateDirectionClient", "n2");
          break;
        }
      }
    }
  }

  @SubscribeMessage("updatePlayerPosServer")
  handleUpdatePlayerPos(
    client: Socket,
    param: { pos: number; id: number }
  ): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.roomPause(client)) {
      return;
    }
    if (this.isPlayerOne(client)) {
      if (param.id === 1) {
        this.roomPlayerPosition(client)[0] = param.pos;
      } else {
        this.roomPlayerPosition(client)[1] = param.pos;
      }
      this.server.to(this.roomId(client)).emit("updatePlayerPosClient", param);
    }
  }

  @SubscribeMessage("updateBallPosServer")
  handleUpdateBallPos(
    client: Socket,
    param: { posX: number; posY: number }
  ): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.roomPause(client)) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.roomBallPosition(client)[0] = param.posX;
      this.roomBallPosition(client)[1] = param.posY;
      this.server.to(this.roomId(client)).emit("updateBallPosClient", param);
    }
  }

  @SubscribeMessage("updateBallDirServer")
  handleUpdateBallDirection(client: Socket, param: Array<number>): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.roomPause(client)) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.roomBallDirection(client)[0] = param[0];
      this.roomBallDirection(client)[1] = param[1];
      this.server.to(this.roomId(client)).emit("updateBallDirClient", param);
    }
  }

  @SubscribeMessage("updateScoreServer")
  handleUpdateScore(
    client: Socket,
    param: { playerNumber: number; score: number }
  ): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.roomPause(client)) {
      return;
    }
    if (this.isPlayerOne(client)) {
      if (param.playerNumber === 1) {
        this.roomScore(client)[0] = param.score;
      } else {
        this.roomScore(client)[1] = param.score;
      }
      this.server.to(this.roomId(client)).emit("updateScoreClient", param);
    }
  }

  @SubscribeMessage("updateReadyServer")
  handleUpdateReady(client: Socket, ready: boolean): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].ready[0] = ready;
    } else {
      this.rooms[this.findCurrentRoom(client)].ready[1] = ready;
    }
    if (
      this.rooms[this.findCurrentRoom(client)].ready[0] &&
      this.rooms[this.findCurrentRoom(client)].ready[1]
    ) {
      this.server.to(this.roomId(client)).emit("updateReadyClient", true);
    } else {
      this.server.to(this.roomId(client)).emit("updateReadyClient", false);
    }
  }

  @SubscribeMessage("updateQueueServer")
  handleUpdateQueue(client: Socket, queueStatus: boolean): void {
    if (queueStatus === true) {
      this.joinRoom(client);
      if (this.roomIsFull(client)) {
        this.server.to(this.roomId(client)).emit("updateQueueClient");
      }
    } else {
      this.server.to(this.roomId(client)).emit("updateQueueClient");
      this.leaveRoom(client);
    }
  }

  @SubscribeMessage("updateCustomServer")
  handleUpdateCustom(client: Socket, customStatus: boolean): void {
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].custom[0] = customStatus;
    } else {
      this.rooms[this.findCurrentRoom(client)].custom[1] = customStatus;
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
        room.players[0] === client.handshake.auth.id.toString() ||
        room.players[1] === client.handshake.auth.id.toString()
      ) {
        return this.rooms.indexOf(room);
      }
    }
    return -1;
  }

  createRoom(client: Socket): void {
    const newRoom: Room = {
      roomId: randomUUID(),
      players: ["", ""],
      spectators: [],
      ready: [false, false],
      pause: [false, false],
      playerPosition: [],
      ballPosition: [],
      ballDirection: [],
      score: [0, 0],
      custom: [false, false],
    };
    this.rooms.push(newRoom);
    this.logger.log(newRoom.ballPosition);
  }

  logRoom(): void {
    for (const room of this.rooms) {
      this.logger.log(
        `Rooms status:
  room ID: ${room.roomId}
  P1 ID: ${room.players[0]}
  P2 ID: ${room.players[1]}`
      );
    }
  }

  isPlayerOne(client: Socket): boolean {
    if (
      this.rooms[this.findCurrentRoom(client)].players[0] ===
      client.handshake.auth.id.toString()
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

  roomId(client: Socket): string {
    return this.rooms[this.findCurrentRoom(client)].roomId;
  }

  roomReady(client: Socket): Array<boolean> {
    return this.rooms[this.findCurrentRoom(client)].ready;
  }

  roomPause(client: Socket): boolean {
    if (
      this.rooms[this.findCurrentRoom(client)].pause[0] ||
      this.rooms[this.findCurrentRoom(client)].pause[1]
    ) {
      return true;
    }
    return false;
  }

  roomPlayerPosition(client: Socket): Array<number> {
    return this.rooms[this.findCurrentRoom(client)].playerPosition;
  }

  roomBallPosition(client: Socket): Array<number> {
    return this.rooms[this.findCurrentRoom(client)].ballPosition;
  }

  roomBallDirection(client: Socket): Array<number> {
    return this.rooms[this.findCurrentRoom(client)].ballDirection;
  }

  roomScore(client: Socket): Array<number> {
    return this.rooms[this.findCurrentRoom(client)].score;
  }

  roomCustom(client: Socket): Array<boolean> {
    return this.rooms[this.findCurrentRoom(client)].custom;
  }
}
