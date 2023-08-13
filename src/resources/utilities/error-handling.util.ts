import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { DrizzleError } from 'drizzle-orm';

export function handleServiceError(error: any, defaultMessage: string): void {
	if (error instanceof DrizzleError) {
		console.error(error.message);
	} else if (error instanceof HttpException) {
		throw error;
	} else {
		const message =
			error?.message || error?.response?.message || defaultMessage;
		throw new InternalServerErrorException(message);
	}
}
