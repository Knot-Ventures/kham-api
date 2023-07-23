import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import {
	businessEntityTypeEnum,
	userTypeEnum,
} from '../../../drizzle/schema/users';

export class UserDto {
	@IsNumber()
	id: number;

	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	@IsOptional()
	@ApiProperty()
	profileImage?: string;

	@IsEnum(userTypeEnum)
	@ApiProperty()
	userType: 'individual' | 'business';

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
