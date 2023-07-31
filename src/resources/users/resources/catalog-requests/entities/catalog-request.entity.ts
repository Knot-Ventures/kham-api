import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import { EnumTypeFromMap } from '../../../../../helpers/EnumTypeFromMap';

import { OptionalApiProperty } from 'src/openapi/decorators';
import catalogRequests from '../../../../../drizzle/schema/catalog_requests';
import { CatalogRequestContactInfoEntity } from './contact-info.entity';

export const CatalogRequestStatusType = {
	Fulfilled: 'fulfilled',
	Accepted: 'accepted',
	Rejected: 'rejected',
	Canceled: 'canceled',
	Voided: 'voided',
	PendingResponse: 'pending_response',
	Parked: 'parked',
} as const;

export type CatalogRequestStatusType = EnumTypeFromMap<
	typeof CatalogRequestStatusType
>;
export type CatalogRequestModel = InferModel<typeof catalogRequests>;

export class CatalogRequestEntity
	implements
		Partial<
			CatalogRequestModel & {
				requestContactInfo: CatalogRequestContactInfoEntity;
			}
		>
{
	@ApiProperty()
	id: string;

	@ApiProperty()
	userId: string;

	@ApiProperty()
	requestContactInfoId: string;

	@ApiProperty()
	itemCount: number;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	submittedAt: Date;

	@ApiProperty()
	respondedAt: Date;

	@ApiProperty({ enum: CatalogRequestStatusType })
	status: CatalogRequestStatusType;

	@ApiProperty()
	notes: string;

	@ApiProperty()
	otherItems: any;

	@OptionalApiProperty({ type: () => CatalogRequestContactInfoEntity })
	requestContactInfo: CatalogRequestContactInfoEntity;
}
