import { Request } from "express";
import { Controller, Get, Req, Res, Post, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard'
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { ExtractJwt } from 'passport-jwt';
import jwt_decode from "jwt-decode";
import { User as UserMode1 } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)// je pense que doit recevoir {username, password} obligatoirement ex: {username, login} => error
	@Post('login')
	async login(@Res({ passthrough: true }) response: Response, @Req() req) {
		let jwt_tokens = await this.authService.login(req.user)

		response.cookie('jwt', jwt_tokens.refresh_token, { maxAge: 3600000/* , httpOnly: true  */})
		return { user: req.user, jwt_token: jwt_tokens.access_token };
	}

	@UseGuards(JwtAuthGuard)
	@Get('validate')
	validAuth() {
		return {message: 'success'};
	}

	@UseGuards(JwtRefreshAuthGuard)
	@Get('refresh')
	async refresh(@Req() req) {
		const user: UserMode1 =
			jwt_decode(ExtractJwt.fromExtractors([(request: Request) => request?.cookies["jwt"]]))
		const jwt_tokens = await this.authService.refreshTokens(user)
		return { user: req.user, jwt_token: jwt_tokens.access_token };
	}
}
