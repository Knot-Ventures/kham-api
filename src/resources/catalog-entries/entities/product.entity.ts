import { ApiProperty } from '@nestjs/swagger';
import { InferModel } from 'drizzle-orm';
import products from '../../../drizzle/schema/products';

export type ProductModel = InferModel<typeof products>;

export class ProductEntity implements ProductModel {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	eNumber: string;

	@ApiProperty()
	otherNames: string;

	@ApiProperty()
	uses: string;
}
