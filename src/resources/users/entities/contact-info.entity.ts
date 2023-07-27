import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import userContactInfo from '../../../drizzle/schema/user_contact_info';
import { OptionalApiProperty } from '../../../openapi/decorators';

export class GeoLocation {
	@ApiProperty()
	latitude: string;
	@ApiProperty()
	longitude: string;
}
export type UserContactInfoModel = InferModel<typeof userContactInfo>;

@ApiExtraModels(GeoLocation)
export class UserContactInfoEntity implements UserContactInfoModel {
	@OptionalApiProperty()
	address: string;
	@OptionalApiProperty({ type: () => GeoLocation })
	location: GeoLocation;
	@OptionalApiProperty()
	governorate: string;
	@OptionalApiProperty()
	phoneNumber: string;
	@ApiProperty()
	id: number;
	@OptionalApiProperty()
	city: string;
	@OptionalApiProperty()
	email: string;
	@OptionalApiProperty()
	default: boolean;
}
