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
		callbackURL: 'http://localhost:3000/auth/42/return',
		passReqToCallback: true,
		profileFields: {
			'login': 	'login',
			'username':	'login',
			'avatar':	'image.link',
			'email':	'email',
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
		email: profile.email,
	}
	const user = this.userService.findOrCreate(reqUser)
    return cb(null, user);
  }
}