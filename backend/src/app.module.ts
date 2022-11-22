import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { BlacklistModule } from './blacklist/blacklist.module';
import { FriendshipModule } from './friendship/friendship.module';
import { GameModule } from './game/game.module';
import { MessageModule } from './message/message.module';
import { GameGateway } from './game.gateway';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ChannelModule, BlacklistModule, FriendshipModule, GameModule, MessageModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, GameGateway],
})
export class AppModule {}
