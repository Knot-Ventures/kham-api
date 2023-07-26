// updateUser.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsString,
} from 'class-validator';
import { BusinessType, UserType } from './create-user.dto';

export class UpdateUserDto {
	@IsString()
	@ApiProperty()
	firstName?: string;

	@IsString()
	@ApiProperty()
	lastName?: string;

	@IsString()
	@ApiProperty()
	profileImage?: string;

	@IsEnum(UserType)
	@ApiProperty({ enum: UserType, enumName: 'UserType' })
	userType?: UserType;

	@IsEnum(BusinessType)
	@ApiProperty({ enum: BusinessType, enumName: 'BusinessType' })
	businessType?: BusinessType;

	@IsArray()
	@ArrayMaxSize(256)
	@ApiProperty({ type: [String], isArray: true })
	fcmTokens?: string[];

	@IsNumber()
	@ApiProperty()
	authId: number;

	@IsNumber()
	@ApiProperty()
	contactInfoId?: number;

	@IsNumber()
	@ApiProperty()
	adminAccessId?: number;
}
