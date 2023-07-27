import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import users from '../../../drizzle/schema/users';

enum UserType {
	Individual = 'individual',
	Business = 'business',
}

enum BusinessType {
	Factory = 'factory',
	Supplier = 'supplier',
	Restaurant = 'restaurant',
}

export class User implements InferModel<typeof users> {
	@ApiProperty({ type: Number })
	id: number;

	@ApiProperty({ type: String })
	firstName: string;

	@ApiProperty({ type: String })
	lastName: string;

	@ApiProperty({ type: String })
	profileImage: string;

	@ApiProperty({ enum: UserType })
	userType: UserType;

	@ApiProperty({ enum: BusinessType })
	businessType: BusinessType;

	@ApiProperty({ type: [String], isArray: true })
	fcmTokens: string[];

	@ApiProperty({ type: Number })
	authId: number;

	@ApiProperty({ type: Number })
	contactInfoId: number;

	@ApiProperty({ type: Number })
	adminAccessId: number;

	@ApiProperty({ type: Boolean })
	isActive?: boolean;
}
