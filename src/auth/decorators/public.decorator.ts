import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Public() {
	return applyDecorators(SetMetadata('public', true));
}
