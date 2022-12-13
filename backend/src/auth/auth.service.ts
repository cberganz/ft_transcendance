import { Injectable, Req } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User as UserMode1 } from '@prisma/client';
import { jwtRefreshConstants } from './constants';
import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
		) {}

	async validateUser(username: string, login: string): Promise<UserMode1 | null> {
		const user = await this.userService.user({username: username});

		if (user && user.login === login) { // remplace by hash compare
			// const { password, ...result } = user; => permet de supprimer password de la reponse
			return user;
		}
		return null;
	}

	async login(user: UserMode1) {
		return await this.refreshTokens(user)
	}

	async refreshTokens(user?: UserMode1) {
		const payload 		= { username: user.username, sub: user.id };
		const refreshToken	=
			this.jwtService.sign(
				payload,
				{
					secret: jwtRefreshConstants.secret,
					expiresIn: '60m',
				}
			)

		return {
			refresh_token: refreshToken,
			access_token: this.jwtService.sign(payload),
		};
	}

	async whoAmI(@Req() req) {
		const jwtData: jwt.JwtPayload = jwt_decode(req?.cookies["jwt"]);
		return await this.userService.user({ id: Number(jwtData.sub) });
	}
}
