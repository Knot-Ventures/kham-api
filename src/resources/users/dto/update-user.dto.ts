// updateUser.dto.ts
import { ArrayMaxSize, IsArray, IsEnum, IsString } from 'class-validator';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { BusinessType, UserType } from '../entities/user.entity';

export class UpdateUserDto {
	@IsString()
	@OptionalApiProperty({ example: 'John' })
	firstName?: string;

	@IsString()
	@OptionalApiProperty({ example: 'Doe' })
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
	@ArrayMaxSize(2)
	@OptionalApiProperty({
		isArray: true,
		example: [
			'c2aK9KHmw8E:APA91bF7MY9bNnvGAXgbHN58lyDxc9KnuXNXwsqUs4uV4GyeF06HM1hMm-etu63S_4C-GnEtHAxJPJJC4H__VcIk90A69qQz65toFejxyncceg0_j5xwoFWvPQ5pzKo69rUnuCl1GSSv',
		],
	})
	fcmTokens?: string[];
}
