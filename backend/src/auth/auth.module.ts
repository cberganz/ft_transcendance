import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '15m' },
		}),
	  
	],
	providers: [
		AuthService,
		UserService,
		LocalStrategy,
		JwtStrategy,
		PrismaService
	],
	exports: [AuthService],
	controllers: [AuthController],
})

export class AuthModule {}
