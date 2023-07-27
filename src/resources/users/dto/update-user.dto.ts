// updateUser.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsString,
} from 'class-validator';
import { BusinessType, UserType } from '../entities/user.entity';
import { OptionalApiProperty } from '../../../openapi/decorators';

export class UpdateUserDto {
	@IsString()
	@OptionalApiProperty()
	firstName?: string;

	@IsString()
	@OptionalApiProperty()
	lastName?: string;

	@IsString()
	@OptionalApiProperty()
	profileImage?: string;

	@IsEnum(UserType)
	@OptionalApiProperty({ enum: UserType, enumName: 'UserType' })
	userType?: UserType;

	@IsEnum(BusinessType)
	@OptionalApiProperty({ enum: BusinessType, enumName: 'BusinessType' })
	businessType?: BusinessType;

	@IsArray()
	@ArrayMaxSize(256)
	@OptionalApiProperty({ isArray: true })
	fcmTokens?: string[];

	@IsString()
	@OptionalApiProperty()
	authId: string;

	@IsNumber()
	@OptionalApiProperty()
	contactInfoId?: number;

	@IsNumber()
	@OptionalApiProperty()
	adminAccessId?: number;
}
