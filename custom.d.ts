import 'express';
import { User } from '@prisma/client';

import * as firebase from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-namespace
export declare module 'express' {
	export interface Request {
		user?: {
			data?: User;
			firebaseUser?: firebase.auth.DecodedIdToken;
		};
	}
}
