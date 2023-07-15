// updateUser.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { businessEntityTypeEnum, userTypeEnum } from 'src/drizzle/schema/users';

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	@ApiProperty()
	firstName?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	lastName?: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	profileImage?: string;

	@IsEnum(userTypeEnum)
	@IsOptional()
	@ApiProperty()
	userType?: 'individual' | 'business';

	@IsEnum(businessEntityTypeEnum)
	@IsOptional()
	@ApiProperty()
	businessType?: 'factory' | 'supplier' | 'restaurant';

	@IsArray()
	@ArrayMaxSize(256)
	@IsOptional()
	@ApiProperty()
	fcmTokens?: string[];

	@IsNumber()
	@ApiProperty()
	authId: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	contactInfoId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty()
	adminAccessId?: number;
}
