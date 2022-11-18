import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

interface Room {
  roomId: number;
  p1Id: string;
  p2Id: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');
  private roomId = 0;
  private rooms: Array<Room> = [];

  createRoom(): void {
    this.roomId += 1;
    const newRoom: Room = { roomId: this.roomId, p1Id: '', p2Id: '' };
    this.rooms.push(newRoom);
  }

  findAvailableRoom(): number {
    for (const room of this.rooms) {
      if (room.p1Id === '' || room.p2Id === '') {
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

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: string): void {
    if (this.rooms[this.findCurrentRoom(client.id)].p1Id === client.id) {
      switch (message) {
        case 'u': {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit('msgToClient', 'u1');
          break;
        }
        case 'd': {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit('msgToClient', 'd1');
          break;
        }
        case 'n': {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit('msgToClient', 'n1');
          break;
        }
      }
    } else {
      switch (message) {
        case 'u': {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit('msgToClient', 'u2');
          break;
        }
        case 'd': {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit('msgToClient', 'd2');
          break;
        }
        case 'n': {
          this.server
            .to(this.rooms[this.findCurrentRoom(client.id)].roomId.toString())
            .emit('msgToClient', 'n2');
          break;
        }
      }
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    if (this.findCurrentRoom(client.id) !== -1) {
      this.handleLeaveRoom(client);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.handleJoinRoom(client);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket): void {
    if (this.rooms.length === 0 || this.findAvailableRoom() === -1) {
      this.createRoom();
      this.rooms[this.rooms.length - 1].p1Id = client.id;
    } else if (this.rooms[this.findAvailableRoom()].p1Id === '') {
      this.rooms[this.findAvailableRoom()].p1Id = client.id;
    } else if (this.rooms[this.findAvailableRoom()].p2Id === '') {
      this.rooms[this.findAvailableRoom()].p2Id = client.id;
    }
    client.join(this.rooms[this.findCurrentRoom(client.id)].roomId.toString());
    this.logger.log(
      `Client ${client.id} joined the room: ${this.rooms[
        this.findCurrentRoom(client.id)
      ].roomId.toString()}`,
    );
    for (const room of this.rooms) {
      this.logger.log(
        `Rooms status:
		  room ID: ${room.roomId},
		  P1 ID: ${room.p1Id},
		  P2 ID: ${room.p2Id}`,
      );
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket): void {
    client.leave(this.rooms[this.findCurrentRoom(client.id)].roomId.toString());
    this.logger.log(
      `Client ${client.id} left the room: ${this.rooms[
        this.findCurrentRoom(client.id)
      ].roomId.toString()}`,
    );
    for (const room of this.rooms) {
      if (room.p1Id === client.id) {
        room.p1Id = '';
      } else if (room.p2Id === client.id) {
        room.p2Id = '';
      }
      if (room.p1Id === '' && room.p2Id === '') {
        this.rooms.splice(this.rooms.indexOf(room), 1);
      }
    }
    for (const room of this.rooms) {
      this.logger.log(
        `Rooms status:
			room ID: ${room.roomId},
			P1 ID: ${room.p1Id},
			P2 ID: ${room.p2Id}`,
      );
    }
  }
}
