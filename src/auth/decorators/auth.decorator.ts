import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: string[]) {
	return applyDecorators(
		SetMetadata('roles', roles),
		ApiBearerAuth(),
		UseGuards(FirebaseAuthGuard, RolesGuard),
	);
}
