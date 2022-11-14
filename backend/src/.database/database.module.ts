import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/database/user.entity';
import { Channels } from 'src/database/channels.entity';
import { Messages } from 'src/database/messages.entity';
import { Games } from 'src/database/games.entity';

@Module({
imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          User,
		  Channels,
		  Messages,
		  Games,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
