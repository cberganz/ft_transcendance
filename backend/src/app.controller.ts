import { Controller, Get, Req, Res, Post, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	async login(@Res({ passthrough: true }) response: Response, @Req() req) {
		let jwt_token = await this.authService.login(req.user)
		response.cookie('jwt', jwt_token.access_token, { maxAge: 60000/* , httpOnly: true  */})
		return jwt_token;
	}

	@UseGuards(JwtAuthGuard)
	@Get('auth/validate')
	validAuth() {
		return {message: 'success'};
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() req) {
		return {"message": "success"}/* req.user */;
	}
}
