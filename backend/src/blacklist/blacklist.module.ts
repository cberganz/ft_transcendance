import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, BlacklistService],
  controllers: [BlacklistController]
})
export class BlacklistModule {}
