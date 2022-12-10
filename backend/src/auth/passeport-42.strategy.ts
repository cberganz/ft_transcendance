var FortyTwoStrategy = require('passport-42').Strategy;
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User as UserMode1 } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { UserService } from '../user/user.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService	
	) {
    super({
		clientID: "u-s4t2ud-babd89035961565c02cce8ca8292efbdb072d51144435629670938c336b6c57a",
		clientSecret: "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",
		callbackURL: 'http://localhost:3000/auth/42/return',//'/auth/42/return',
		passReqToCallback: true,
		profileFields: {
			'login': 'login',
			'username': 'displayname',
			'avatar': 'image.link',
		  }		
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
	const reqUser = {
		login: profile.login,
		username: profile.username,
		avatar: profile.avatar,
	}
	const user = this.userService.findOrCreate(reqUser)
	// const jwt_tokens = await this.authService.refreshTokens(user)

    // request.session.accessToken = accessToken;
	// this.userService.findOrCreate(profile)
	// console.log('profile: ', user, '\n')
    // console.log('accessToken', accessToken, 'refreshToken', refreshToken);
    // In this example, the user's 42 profile is supplied as the user
    // record.  In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, user);
  }
}