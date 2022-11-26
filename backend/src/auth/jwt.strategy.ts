import { Request } from "express";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import jwt from 'jsonwebtoken';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies["jwt"]]),
			//ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
		});
	}

	async validate(payload: jwt.JwtPayload) {
		if(payload === null){
			throw new UnauthorizedException();
        }
		return { userId: payload.sub, username: payload.username };
	}
}
