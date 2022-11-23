import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService]
})
export class ChatModule {}
