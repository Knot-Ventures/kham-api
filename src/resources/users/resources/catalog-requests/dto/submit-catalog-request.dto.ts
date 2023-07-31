import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { CatalogRequestStatusType } from '../entities/catalog-request.entity';

export class SubmitCatalogRequestDto {
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
