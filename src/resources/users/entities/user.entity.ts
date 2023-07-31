import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import users from '../../../drizzle/schema/users';
import { EnumTypeFromMap } from '../../../helpers/EnumTypeFromMap';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { AdminAccessEntity } from './admin-access.entity';
import { UserContactInfoEntity } from './contact-info.entity';

export const UserType = {
	Individual: 'individual',
	Business: 'business',
} as const;

export type UserType = EnumTypeFromMap<typeof UserType>;

export const BusinessType = {
	Factory: 'factory',
	Supplier: 'supplier',
	Restaurant: 'restaurant',
} as const;
export type BusinessType = EnumTypeFromMap<typeof BusinessType>;

export type UserModel = InferModel<typeof users>;

export class UserEntity
	implements
		Partial<
			UserModel & {
				userContactInfo: UserContactInfoEntity;
				adminAccess: AdminAccessEntity;
			}
		>
{
	@ApiProperty()
	id: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	profileImage: string;

	@ApiProperty({ enum: UserType })
	userType: UserType;

	@ApiProperty({ enum: BusinessType })
	businessType: BusinessType;

	@ApiProperty({ isArray: true })
	fcmTokens: string[];

	@ApiProperty()
	authId: string;

	@ApiProperty()
	contactInfoId: string;

	@OptionalApiProperty({ type: () => UserContactInfoEntity })
	contactInfo?: UserContactInfoEntity;

	@ApiProperty()
	adminAccessId: string;

	@OptionalApiProperty({ type: () => AdminAccessEntity })
	adminAccess?: AdminAccessEntity;

	@ApiProperty()
	isActive: boolean;
}
