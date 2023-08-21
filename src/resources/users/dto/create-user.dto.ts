import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsEnum, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { BusinessType, UserType } from '../entities/user.entity';
import { CreateAdminAccessDto } from './create-admin-access.dto';
import { CreateContactInfoDto } from './create-contact-info.dto';
import * as uuid from 'uuid';

@ApiExtraModels(CreateAdminAccessDto, CreateContactInfoDto)
export class CreateUserDto {
	@IsString()
	@ApiProperty({ example: 'John' })
	firstName?: string;

	@IsString()
	@ApiProperty({ example: 'Doe' })
	lastName?: string;

	@IsString()
	@OptionalApiProperty()
	profileImage?: string;

	@IsEnum(UserType)
	@ApiProperty({ enum: UserType })
	userType: UserType;

	@IsEnum(BusinessType)
	@OptionalApiProperty({ enum: BusinessType })
	businessType?: BusinessType;

	@IsArray()
	@ArrayMaxSize(1)
	@OptionalApiProperty({
		isArray: true,
		example: [
			'c2aK9KHmw8E:APA91bF7MY9bNnvGAXgbHN58lyDxc9KnuXNXwsqUs4uV4GyeF06HM1hMm-etu63S_4C-GnEtHAxJPJJC4H__VcIk90A69qQz65toFejxyncceg0_j5xwoFWvPQ5pzKo69rUnuCl1GSSv',
		],
	})
	fcmTokens?: string[];

	@IsString()
	@ApiProperty({ example: uuid.v1() })
	authId: string;

	@OptionalApiProperty()
	isActive?: boolean;

	@OptionalApiProperty({ type: () => CreateContactInfoDto })
	contactInfoData?: CreateContactInfoDto;
}
