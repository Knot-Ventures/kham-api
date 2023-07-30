import { Global, Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Messaging } from 'firebase-admin/messaging';
import axios from 'axios';
import * as process from 'process';

@Injectable()
export class FirebaseService {
	private _defaultApp: firebase.app.App;
	private _messaging: Messaging;

	get defaultApp() {
		return this._defaultApp;
	}
	get messaging() {
		return this._messaging;
	}

	async signin({ email, password }) {
		return axios.post(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(
				process.env.FIREBASE_WEB_API_KEY,
			)}`,
			{
				email,
				password,
				returnSecureToken: true,
			},
		);
	}

	constructor() {
		this._defaultApp = firebase.initializeApp({
			credential: firebase.credential.cert(
				JSON.parse(
					Buffer.from(
						process.env.FIREBASE_SERVICE_ACCOUNT,
						'base64',
					).toString('utf-8'),
				),
			),
		});
		this._messaging = this._defaultApp.messaging();
	}
}
