import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, FriendshipService],
  controllers: [FriendshipController]
})
export class FriendshipModule {}
