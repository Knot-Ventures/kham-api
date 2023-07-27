import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsString,
} from 'class-validator';
import { CreateContactInfoDto } from './create-contact-info.dto';
import { CreateAdminAccessDto } from './create-admin-access.dto';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { BusinessType, UserType } from '../entities/user.entity';

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

	@IsNumber()
	@OptionalApiProperty()
	contactInfoId?: number;

	@IsNumber()
	@OptionalApiProperty()
	adminAccessId?: number;

	@OptionalApiProperty()
	isActive?: boolean;

	@OptionalApiProperty({ type: () => CreateContactInfoDto })
	contactInfoData?: CreateContactInfoDto;

	@OptionalApiProperty({ type: () => CreateAdminAccessDto })
	adminAccessData?: CreateAdminAccessDto;
}
