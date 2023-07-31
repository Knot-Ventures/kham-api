import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import catalogRequestContactInfo from '../../../../../drizzle/schema/catalog_request_contact_info';
import { OptionalApiProperty } from '../../../../../openapi/decorators';

export class GeoLocation {
	@ApiProperty()
	latitude: string;
	@ApiProperty()
	longitude: string;
}
export type CatalogRequestContactInfoModel = InferModel<
	typeof catalogRequestContactInfo
>;

@ApiExtraModels(GeoLocation)
export class CatalogRequestContactInfoEntity
	implements CatalogRequestContactInfoModel
{
	@ApiProperty()
	id: string;

	@OptionalApiProperty()
	governorate: string;

	@OptionalApiProperty()
	city: string;

	@OptionalApiProperty()
	address: string;

	@OptionalApiProperty()
	phoneNumber: string;

	@OptionalApiProperty()
	email: string;

	@OptionalApiProperty({ type: () => GeoLocation })
	location: GeoLocation;
}
