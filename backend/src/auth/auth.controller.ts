import {
	Controller,
	Get,
	Redirect,
	Req,
	Res,
	Post,
	Body,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './local-auth.guard'
import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User as UserMode1 } from '@prisma/client';
import { FtOauthGuard } from './ftAuth.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService
		) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Res({ passthrough: true }) response: Response, @Req() req) {
		const jwt_tokens = await this.authService.login(req.user)
		const userDataResp = { 
			username: req.user.username,
			login: req.user.login,
			avatar: req.user.avatar,
			id: req.user.id,
		}
		response.cookie(
			'jwt', 
			jwt_tokens.refresh_token,
			{ 
				maxAge: 3600000, 
				httpOnly: true,
				sameSite: 'none',
				secure: true
			}
		)
		return { user: userDataResp, jwt_token: jwt_tokens.access_token };
	}

	@UseGuards(JwtRefreshAuthGuard)
	@Get('refresh')
	async refresh(@Req() req) {
		const user: UserMode1 = await this.authService.whoAmI(req)
		const userDataResp = { 
			username: user.username,
			login: user.login,
			avatar: user.avatar,
			id: user.id,
			isTFAEnabled: user.isTFAEnabled,
		}
		const jwt_tokens = await this.authService.refreshTokens(user)
		return { user: userDataResp, jwt_token: jwt_tokens.access_token };
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true})
		response.status(204)
	}

	@Get('42')
	@UseGuards(FtOauthGuard)
	ftAuth() {
	  return;
	}
  
	@Get('42/return')
	@UseGuards(FtOauthGuard)
	async ftAuthCallback(@Res({ passthrough: true }) response: Response, @Req() req) {
		console.log(req.user)
		if (req.user.isTFAEnabled) {
			response.redirect("http://localhost:3001")
			return ;
		}
		req = await this.login(response, req)
		response.redirect("http://localhost:3001")
	}

	@Post('2fa/authenticate')
	@UseGuards(JwtAuthGuard)
	async authenticate(@Req() request, @Body() body) {
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			request.user,
		);
	}
}
