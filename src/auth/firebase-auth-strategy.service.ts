import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
	Strategy as FirebaseJwtStrategy,
	ExtractJwt,
} from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';
import { DrizzleService } from '../drizzle/drizzle.service';
import Users from '../drizzle/schema/users';
import { UsersService } from '../resources/users/users.service';
import { resolve } from '../helpers/resolve';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
	FirebaseJwtStrategy,
) {
	private defaultApp: firebase.app.App;

	constructor(
		private firebase: FirebaseService,
		private usersService: UsersService,
	) {
		super({
			jwtFromRequest: (request) => {
				return (
					request.handshake?.headers ?? request.headers
				)?.authorization?.split(/\s/)[1];
				//ExtractJwt.fromAuthHeaderAsBearerToken
			},
		});
	}

	async validate(token: string) {
		console.log({ token });

		const firebaseUser = await this.firebase.defaultApp
			.auth()
			.verifyIdToken(token, true)
			.catch((err) => {
				console.log(err);
				throw new UnauthorizedException(err.message);
			});

		if (!firebaseUser) {
			throw new UnauthorizedException();
		}
		const [user, error] = await resolve(
			this.usersService.findOneByAuthId(firebaseUser.uid),
		);

		return { data: user, firebaseUser };
	}
}
