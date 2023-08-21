import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import users from '../../../drizzle/schema/users';
import { EnumTypeFromMap } from '../../../helpers/EnumTypeFromMap';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { AdminAccessEntity } from './admin-access.entity';
import { UserContactInfoEntity } from './contact-info.entity';
import * as uuid from 'uuid';

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
				userContactInfo: UserContactInfoEntity[];
				adminAccess: AdminAccessEntity;
			}
		>
{
	@ApiProperty({
		example: uuid.v1(),
	})
	id: string;

	@ApiProperty({ example: 'John' })
	firstName: string;

	@ApiProperty({ example: 'Doe' })
	lastName: string;

	@OptionalApiProperty()
	profileImage?: string;

	@ApiProperty({ enum: UserType })
	userType: UserType;

	@OptionalApiProperty({ enum: BusinessType })
	businessType?: BusinessType;

	@OptionalApiProperty({
		isArray: true,
		example: [
			'c2aK9KHmw8E:APA91bF7MY9bNnvGAXgbHN58lyDxc9KnuXNXwsqUs4uV4GyeF06HM1hMm-etu63S_4C-GnEtHAxJPJJC4H__VcIk90A69qQz65toFejxyncceg0_j5xwoFWvPQ5pzKo69rUnuCl1GSSv',
		],
	})
	fcmTokens?: string[];

	@ApiProperty({ example: uuid.v1() })
	authId: string;

	@OptionalApiProperty({ type: () => UserContactInfoEntity, isArray: true })
	contactInfo?: UserContactInfoEntity[];

	@OptionalApiProperty({ example: uuid.v1() })
	adminAccessId: string;

	@OptionalApiProperty({ type: () => AdminAccessEntity })
	adminAccess?: AdminAccessEntity;

	@ApiProperty()
	isActive: boolean;
}
