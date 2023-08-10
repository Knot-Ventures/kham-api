import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsEnum, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { BusinessType, UserType } from '../entities/user.entity';
import { CreateAdminAccessDto } from './create-admin-access.dto';
import { CreateContactInfoDto } from './create-contact-info.dto';

@ApiExtraModels(CreateAdminAccessDto, CreateContactInfoDto)
export class CreateUserDto {
	@IsString()
	@ApiProperty()
	firstName: string;

	@IsString()
	@ApiProperty()
	lastName: string;

	@IsString()
	@OptionalApiProperty()
	profileImage?: string;

	@IsEnum(UserType)
	@ApiProperty({ enum: UserType, required: true })
	userType: UserType;

	@IsEnum(BusinessType)
	@OptionalApiProperty({ enum: BusinessType })
	businessType?: BusinessType;

	@IsArray()
	@ArrayMaxSize(256)
	@OptionalApiProperty({ isArray: true })
	fcmTokens?: string[];

	@IsString()
	@ApiProperty()
	authId: string;

	@IsString()
	@OptionalApiProperty()
	contactInfoId?: string;

	@IsString()
	@OptionalApiProperty()
	adminAccessId?: string;

	@OptionalApiProperty()
	isActive?: boolean;

	@OptionalApiProperty({ type: () => CreateContactInfoDto })
	contactInfoData?: CreateContactInfoDto;

	@OptionalApiProperty({ type: () => CreateAdminAccessDto })
	adminAccessData?: CreateAdminAccessDto;
}
