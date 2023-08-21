import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: string[]) {
	const isProduction = process.env.NODE_ENV === 'production';

	const decorators = [SetMetadata('roles', roles), ApiBearerAuth()];

	if (isProduction || true) {
		decorators.push(UseGuards(FirebaseAuthGuard, RolesGuard));
	}

	return applyDecorators(...decorators);
}
