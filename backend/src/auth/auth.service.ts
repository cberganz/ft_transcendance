import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User as UserMode1 } from '@prisma/client';

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
		const payload = { username: user.username, sub: user.id };

		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
