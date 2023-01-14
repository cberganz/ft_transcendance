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
  reload: boolean;
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
  private clientList: Map<string, Socket> = new Map<string, Socket>();
  private players: Array<string> = [];

  afterInit(server: Server) {
    this.logger.log("Init");
  }

  handleClient(client: Socket) {
    console.log(this.clientList.get(client.handshake.auth.id.toString()));
    if (this.clientList.get(client.handshake.auth.id.toString())) {
      this.server
        .to(this.clientList.get(client.handshake.auth.id.toString()).id)
        .disconnectSockets();
      this.clientList.delete(client.handshake.auth.id.toString());
    }
    this.clientList.set(client.handshake.auth.id.toString(), client);
    console.log(this.clientList.keys());
  }

  async handleConnection(client: Socket, ...args: any[]) {
    // console.log(this.server);
    this.logger.log(
      `Client connected: ID ${client.handshake.auth.id.toString()}`
    );
    if (!this.players.includes(client.handshake.auth.id.toString())) {
      this.players.push(client.handshake.auth.id.toString());
    }
    const sockets = await this.server.fetchSockets();
    console.log(sockets.length);
    // this.handleClient(client);
    this.reconnectRoom(client);
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].pause[0] = false;
    } else if (this.isPlayerTwo(client)) {
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
    this.logRoom();
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].pause[0] = true;
    } else if (this.isPlayerTwo(client)) {
      this.rooms[this.findCurrentRoom(client)].pause[1] = true;
    }
  }

  joinRoom(client: Socket): void {
    if (this.reconnectRoom(client)) {
      return;
    }
    if (this.rooms.length === 0 || this.findAvailableRoom() === -1) {
      this.createRoom();
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
      } else if (this.isPlayerTwo(client)) {
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
    if (this.isSpectator(client)) {
      for (const room of this.rooms) {
        if (room.spectators.includes(client.handshake.auth.id.toString())) {
          room.spectators.splice(
            room.spectators.indexOf(client.handshake.auth.id.toString(), 1)
          );
        }
      }
    } else {
      for (const room of this.rooms) {
        if (
          room.players[0] === client.handshake.auth.id.toString() ||
          room.players[1] === client.handshake.auth.id.toString()
        ) {
          this.rooms.splice(this.rooms.indexOf(room), 1);
        }
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
    if (this.isSpectator(client)) {
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
    if (this.isSpectator(client)) {
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
    if (this.isSpectator(client)) {
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
    if (this.isSpectator(client)) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].ready[0] = ready;
    } else if (this.isPlayerTwo(client)) {
      this.rooms[this.findCurrentRoom(client)].ready[1] = ready;
    }
    if (
      this.rooms[this.findCurrentRoom(client)].ready[0] &&
      this.rooms[this.findCurrentRoom(client)].ready[1]
    ) {
      this.server.to(this.roomId(client)).emit("updateReadyClient", true);
      if (!this.rooms[this.findCurrentRoom(client)].reload) {
        this.rooms[this.findCurrentRoom(client)].reload = true;
        this.server.to(this.roomId(client)).emit("reloadClient");
      }
    } else {
      this.server.to(this.roomId(client)).emit("updateReadyClient", false);
    }
  }

  @SubscribeMessage("updateQueueServer")
  handleUpdateQueue(client: Socket, queueStatus: boolean): void {
    if (this.findCurrentRoom(client) === -1) {
      return;
    }
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
    if (this.isSpectator(client)) {
      return;
    }
    if (this.isPlayerOne(client)) {
      this.rooms[this.findCurrentRoom(client)].custom[0] = customStatus;
    } else if (this.isPlayerTwo(client)) {
      this.rooms[this.findCurrentRoom(client)].custom[1] = customStatus;
    }
  }

  @SubscribeMessage("endGameServer")
  handleEndGame(client: Socket): void {
    if (this.isSpectator(client)) {
      return;
    }
    const param = {
      p1Id: +this.roomPlayers(client)[0],
      p2Id: +this.roomPlayers(client)[1],
      isp1: false,
    };
    if (this.isPlayerOne(client)) {
      param.isp1 = true;
    }
    this.server.to(client.id).emit("endGameClient", param);
  }

  @SubscribeMessage("invitationGameServer")
  handleInvitationGame(client: Socket, id: string): void {
    if (this.findRoomById(id) === -1) {
      this.createRoom(id);
      this.rooms[this.findRoomById(id)].players[0] =
        client.handshake.auth.id.toString();
    } else {
      this.rooms[this.findRoomById(id)].players[1] =
        client.handshake.auth.id.toString();
    }
    client.join(this.roomId(client));
    this.logRoom();
  }

  @SubscribeMessage("spectateGameServer")
  handleSpectateGamee(client: Socket, id: string): void {
    let roomToSpectate = "";

    for (const room of this.rooms) {
      if (room.players[0] === id || room.players[1] === id) {
        roomToSpectate = room.roomId;
      }
    }
    this.rooms[this.findRoomById(roomToSpectate)].spectators.push(
      client.handshake.auth.id.toString()
    );
    client.join(roomToSpectate);
    this.logRoom();
  }

  @SubscribeMessage("updateSpectatorServer")
  handleUpdateSpectator(client: Socket, status: boolean): void {
    if (status === true) {
      return;
      this.joinRoom(client);
      if (this.roomIsFull(client)) {
        this.server.to(this.roomId(client)).emit("updateQueueClient");
      }
    } else {
      this.server.to(client.id).emit("updateSpectatorClient");
      this.leaveRoom(client);
    }
  }

  @SubscribeMessage("testServer")
  handleTest(client: Socket) {
    this.server.to(client.id).emit("testClient");
  }

  findRoomById(id: string): number {
    for (const room of this.rooms) {
      if (room.roomId === id) {
        return this.rooms.indexOf(room);
      }
    }
    return -1;
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
      for (const spectator of room.spectators) {
        if (spectator === client.handshake.auth.id.toString()) {
          return this.rooms.indexOf(room);
        }
      }
    }
    return -1;
  }

  createRoom(id?: string): void {
    const newRoom: Room = {
      roomId: id ? id : randomUUID(),
      players: ["", ""],
      spectators: [],
      ready: [false, false],
      pause: [false, false],
      playerPosition: [],
      ballPosition: [],
      ballDirection: [],
      score: [0, 0],
      custom: [false, false],
      reload: false,
    };
    this.rooms.push(newRoom);
  }

  logRoom(): void {
    for (const room of this.rooms) {
      this.logger.log(
        `Rooms status:
  room ID: ${room.roomId}
  P1 ID: ${room.players[0]}
  P2 ID: ${room.players[1]}
  Spectators: ${room.spectators}`
      );
    }
  }

  isSpectator(client: Socket): boolean {
    for (const room of this.rooms) {
      for (const spectator of room.spectators) {
        if (spectator === client.handshake.auth.id.toString()) {
          return true;
        }
      }
    }
    return false;
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

  isPlayerTwo(client: Socket): boolean {
    if (
      this.rooms[this.findCurrentRoom(client)].players[1] ===
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

  roomPlayers(client: Socket): Array<string> {
    return this.rooms[this.findCurrentRoom(client)].players;
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
