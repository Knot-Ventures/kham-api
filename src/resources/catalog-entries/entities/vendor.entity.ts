import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import vendors from '../../../drizzle/schema/vendors';
import { OptionalApiProperty } from '../../../openapi/decorators';

export type VendorModel = InferModel<typeof vendors>;

export class VendorEntity implements Partial<VendorModel> {
	@ApiProperty()
	id: string;

	@ApiProperty({ example: 'Kham' })
	name: string;

	@OptionalApiProperty({ example: 'New Cairo, Egypt' })
	address?: string;

	@OptionalApiProperty()
	image?: string;
}
