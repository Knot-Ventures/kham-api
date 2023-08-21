import 'express';

import * as firebase from 'firebase-admin';
import { UserEntity } from './src/resources/users/entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare module 'express' {
	export interface Request {
		user?: {
			data?: UserEntity;
			firebaseUser?: firebase.auth.DecodedIdToken;
		};
	}
}
