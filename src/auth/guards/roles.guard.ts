import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>(
			'roles',
			context.getHandler(),
		);
		if (!roles || !roles.length) {
			return true;
		}
		const request: Request = context.switchToHttp().getRequest();
		const user = request.user.data;
		return roles.includes(user?.userType);
	}
}
