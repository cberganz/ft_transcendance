import { Controller, Get, Request, Res, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)// avoid magic strings crearte class for AuthGuard('local') cf. nest Authentication doc
	@Post('auth/login')
	async login(@Request() req) {
		let access_token = await this.authService.login(req.user)
		return access_token;
	}

	@UseGuards(JwtAuthGuard)
	@Get('auth/validate')
	validAuth(@Request() req) {
		return {message: 'success'};
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
}
