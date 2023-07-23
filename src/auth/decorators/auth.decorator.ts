import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth(...roles: string[]) {
	return applyDecorators(
		SetMetadata('roles', roles),
		ApiBearerAuth(),
		// UseGuards(FirebaseAuthGuard, RolesGuard),
	);
}
