import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { Observable } from 'rxjs';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-jwt') {
	constructor(private reflector: Reflector) {
		super();
	}
	async canActivate(context: ExecutionContext): Promise<any> {
		const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		try {
			const result = await super.canActivate(context);
			return isPublic || result;
		} catch (e) {
			if (isPublic) return true;
			else rethrow(e);
		}
	}
}
