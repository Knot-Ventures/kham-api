import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import userContactInfo from '../../../drizzle/schema/user_contact_info';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { GeoLocation } from '../../../data/geolocation';
import * as uuid from 'uuid';

export type UserContactInfoModel = InferModel<typeof userContactInfo>;

@ApiExtraModels(GeoLocation)
export class UserContactInfoEntity implements Partial<UserContactInfoModel> {
	@ApiProperty({ example: uuid.v1() })
	id: string;

	@ApiProperty({ example: uuid.v1() })
	userId: string;

	@OptionalApiProperty({ example: 'Cairo' })
	governorate?: string;

	@OptionalApiProperty({ example: 'Nasr City' })
	city?: string;

	@OptionalApiProperty({ example: '1st Area, Bld.02, Apt.01' })
	address?: string;

	@OptionalApiProperty({ example: '+20-123-456-7890' })
	phoneNumber?: string;

	@OptionalApiProperty({ example: 'john.doe@kham.shop' })
	email?: string;

	@OptionalApiProperty({
		type: () => GeoLocation,
	})
	location?: GeoLocation;

	@OptionalApiProperty()
	default?: boolean;
}
