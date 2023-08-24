import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsObject,
	IsString,
} from 'class-validator';
import { OptionalApiProperty } from '../../../../../../openapi/decorators';

import { CatalogRequestStatusType } from '../../entities/catalog-request.entity';
import { CreateContactInfoDto } from './create-contact-info-request.dto';

export class SubmitUserCatalogRequestDto {
	@IsObject()
	@ApiProperty({ type: () => CreateContactInfoDto })
	requestContactInfo: CreateContactInfoDto;

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
