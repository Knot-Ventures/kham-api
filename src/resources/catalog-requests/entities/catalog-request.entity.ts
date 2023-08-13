import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { InferModel } from 'drizzle-orm';
import catalogRequests from '../../../drizzle/schema/catalog_requests';
import { EnumTypeFromMap } from '../../../helpers/EnumTypeFromMap';
import { OptionalApiProperty } from '../../../openapi/decorators';
import { UserEntity } from '../../../resources/users/entities/user.entity';
import { CatalogRequestContactInfoEntity } from './catalog-request-contact-info.entity';
import { CatalogRequestItemEntity } from './catalog-request-item.entity';

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

export class CatalogRequestEntity implements CatalogRequestModel {
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

	@IsBoolean()
	isRemoved: boolean;

	@OptionalApiProperty({ type: () => CatalogRequestContactInfoEntity })
	requestContactInfo?: CatalogRequestContactInfoEntity;

	@OptionalApiProperty({ type: () => UserEntity })
	user?: UserEntity;

	@OptionalApiProperty({
		type: () => CatalogRequestItemEntity,
		isArray: true,
	})
	catalogRequestItems?: CatalogRequestItemEntity[];
}
