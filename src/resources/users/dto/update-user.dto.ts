// updateUser.dto.ts
import { ArrayMaxSize, IsArray, IsEnum, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { BusinessType, UserType } from '../entities/user.entity';

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

	@IsString()
	@OptionalApiProperty()
	contactInfoId?: string;

	@IsString()
	@OptionalApiProperty()
	adminAccessId?: string;
}
