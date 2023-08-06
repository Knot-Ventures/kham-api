import { ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsArray,
	IsDate,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
} from 'class-validator';

import { CatalogRequestStatusType } from '../entities/catalog-request.entity';
export class UpdateCatalogRequestDto {
	@IsString()
	@ApiPropertyOptional()
	userId?: string;

	@IsString()
	@ApiPropertyOptional()
	requestContactInfoId?: string;

	@IsInt()
	@ApiPropertyOptional()
	itemCount?: number;

	@IsDate()
	@ApiPropertyOptional()
	createdAt?: Date;

	@IsDate()
	@ApiPropertyOptional()
	submittedAt?: Date;

	@IsDate()
	@ApiPropertyOptional()
	respondedAt?: Date;

	@IsEnum(CatalogRequestStatusType)
	@ApiPropertyOptional({ enum: CatalogRequestStatusType })
	status?: CatalogRequestStatusType;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional()
	notes?: string;

	@IsArray()
	@IsOptional()
	@ApiPropertyOptional({ type: [Object] })
	otherItems?: any[];
}
