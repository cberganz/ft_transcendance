import { Controller, Get, Req, Res, Post, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './auth/jwt-refresh-auth.guard';

@Controller()
export class AppController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)// je pense que doit recevoir {username, password} obligatoirement ex: {username, login} => error
	@Post('auth/login')
	async login(@Res({ passthrough: true }) response: Response, @Req() req) {
		let jwt_tokens = await this.authService.login(req.user)

		response.cookie('jwt', jwt_tokens.refresh_token, { maxAge: 3600000/* , httpOnly: true  */})
		return { user: req.user, jwt_token: jwt_tokens.access_token };
	}

	@UseGuards(JwtAuthGuard)
	@Get('auth/validate')
	validAuth() {
		return {message: 'success'};
	}

	@UseGuards(JwtRefreshAuthGuard)
	@Get('auth/refresh')
	refresh() {
		return {message: 'success'};
	}
}
