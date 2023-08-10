import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsDate,
	IsEnum,
	IsInt,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';

import { OptionalApiProperty } from '../../../openapi/decorators';
import { CatalogRequestStatusType } from '../entities/catalog-request.entity';
import { CreateContactInfoDto } from './create-contact-info-dto';

export class CreateCatalogRequestDto {
	@IsString()
	@ApiProperty()
	userId: string;

	@IsString()
	@OptionalApiProperty()
	requestContactInfoId?: string;

	@IsObject()
	@OptionalApiProperty({ type: () => CreateContactInfoDto })
	requestContactInfo?: CreateContactInfoDto;

	@IsInt()
	@ApiProperty()
	itemCount?: number;

	@IsDate()
	@OptionalApiProperty()
	createdAt?: Date;

	@IsDate()
	@OptionalApiProperty()
	submittedAt?: Date;

	@IsDate()
	@OptionalApiProperty()
	respondedAt?: Date;

	@IsEnum(CatalogRequestStatusType)
	@ApiProperty({ enum: CatalogRequestStatusType })
	status: CatalogRequestStatusType;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	notes?: string;

	@IsArray()
	@IsOptional()
	@ApiProperty({ type: [Object], required: false })
	otherItems?: any[];
}
