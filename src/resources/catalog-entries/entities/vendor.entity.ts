import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import vendors from '../../../drizzle/schema/vendors';

export type VendorModel = InferModel<typeof vendors>;

export class VendorEntity implements VendorModel {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	address: string;

	@ApiProperty()
	image: string;
}
