import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEnum,
	IsInt,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';

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
	itemCount: number;

	@IsArray()
	@IsOptional()
	@ApiProperty({ isArray: true })
	otherItems?: any[];

	@IsEnum(CatalogRequestStatusType)
	@ApiProperty({ enum: CatalogRequestStatusType })
	status: CatalogRequestStatusType;

	@IsString()
	@IsOptional()
	@ApiProperty()
	notes?: string;
}
