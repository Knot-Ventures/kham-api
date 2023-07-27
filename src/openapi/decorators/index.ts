import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { IsOptional } from 'class-validator';

export const OptionalApiProperty = (
	apiPropertyOptions?: Omit<ApiPropertyOptions, 'required'>,
	isOptionalOptions?: Parameters<typeof IsOptional>[0],
) =>
	applyDecorators(
		IsOptional(isOptionalOptions),
		ApiProperty({ ...(apiPropertyOptions ?? {}), required: false }),
	);

export const DateApiProperty = (options?: Omit<ApiPropertyOptions, 'type'>) =>
	ApiProperty({ ...(options ?? {}), type: Date });

export const OptionalDateApiProperty = (
	options?: Omit<ApiPropertyOptions, 'required' | 'type'>,
) => ApiProperty({ ...(options ?? {}), type: Date, required: false });
