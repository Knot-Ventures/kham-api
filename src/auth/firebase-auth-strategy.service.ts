import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
	Strategy as FirebaseJwtStrategy,
	ExtractJwt,
} from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
	FirebaseJwtStrategy,
) {
	private defaultApp: firebase.app.App;

	constructor(private firebase: FirebaseService) {
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

		const firebaseUser: any = await this.firebase.defaultApp
			.auth()
			.verifyIdToken(token, true)
			.catch((err) => {
				console.log(err);
				throw new UnauthorizedException(err.message);
			});
		console.log({ firebaseUser });
		if (!firebaseUser) {
			throw new UnauthorizedException();
		}

		//TODO Get User from Database
		const user = {};

		console.log({ user });
		return { data: user, firebaseUser };
	}
}
