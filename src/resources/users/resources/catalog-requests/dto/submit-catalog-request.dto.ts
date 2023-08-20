import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../../../openapi/decorators';

import { CatalogRequestStatusType } from '../entities/catalog-request.entity';

export class SubmitCatalogRequestDto {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	requestContactInfoId: string;

	@IsInt()
	@IsNotEmpty()
	@ApiProperty()
	itemCount: number;

	@IsArray()
	@OptionalApiProperty({ isArray: true })
	otherItems?: any[];

	@IsEnum(CatalogRequestStatusType)
	@ApiProperty({ enum: CatalogRequestStatusType })
	status: CatalogRequestStatusType;

	@IsString()
	@OptionalApiProperty()
	notes?: string;
}
