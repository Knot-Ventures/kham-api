import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { businessTypeEnum } from '../shared/businessEntityTypeEnum';
import { userTypeEnum } from '../shared/userTypeEnum';

export class CreateUserDto {
	@IsString()
	@ApiProperty({ type: String, required: true })
	firstName: string;

	@IsString()
	@ApiProperty({ type: String, required: true })
	lastName: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ type: String, required: false })
	profileImage?: string;

	@IsEnum(userTypeEnum)
	@ApiProperty({ enum: userTypeEnum, required: true })
	userType: userTypeEnum;

	@IsEnum(businessTypeEnum)
	@IsOptional()
	@ApiProperty({ enum: businessTypeEnum, required: false })
	businessType?: businessTypeEnum;

	@IsArray()
	@ArrayMaxSize(256)
	@IsOptional()
	@ApiProperty({ type: String, isArray: true, required: false })
	fcmTokens?: string[];

	@IsNumber()
	@IsOptional()
	@ApiProperty({ type: Number, required: false })
	authId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ type: Number, required: false })
	contactInfoId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ type: Number, required: false })
	adminAccessId?: number;

	@IsBoolean()
	@IsOptional()
	@ApiProperty({ type: Boolean, required: false })
	isActive?: boolean;
}
