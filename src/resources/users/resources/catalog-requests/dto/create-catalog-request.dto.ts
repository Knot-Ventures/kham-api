import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsDate,
	IsEnum,
	IsInt,
	IsObject,
	IsString,
} from 'class-validator';

import { OptionalApiProperty } from '../../../../../openapi/decorators';
import { CatalogRequestStatusType } from '../entities/catalog-request.entity';
import { CreateContactInfoDto } from './create-contact-info-request.dto';

export class CreateCatalogRequestDto {
	@IsString()
	@ApiProperty()
	userId: string;

	@IsObject()
	@ApiProperty({ type: () => CreateContactInfoDto })
	requestContactInfo: CreateContactInfoDto;

	@IsInt()
	@ApiProperty()
	itemCount?: number;

	@IsString()
	@OptionalApiProperty()
	requestContactInfoId?: string;

	@IsDate()
	@OptionalApiProperty()
	createdAt?: Date;

	@IsDate()
	@OptionalApiProperty()
	submittedAt?: Date;

	@IsDate()
	@OptionalApiProperty()
	respondedAt?: Date;

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
