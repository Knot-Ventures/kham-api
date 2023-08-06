import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleError } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import catalogEntries from '../../drizzle/schema/catalog_entries';
import products from '../../drizzle/schema/products';
import vendors from '../../drizzle/schema/vendors';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
import { UpdateCatalogEntryDto } from './dto/update-catalog-entry.dto';
import { CatalogEntryModel } from './entities/catalog-entry.entity';

@Injectable()
export class CatalogEntriesService {
	constructor(private readonly drizzleService: DrizzleService) {}

	async create(
		createCatalogEntryDto: CreateCatalogEntryDto,
	): Promise<CatalogEntryModel> {
		try {
			const newCatalogEntry = await this.drizzleService.db.transaction(
				async (tx) => {
					const { product, vendor, ...catalogEntryData } =
						createCatalogEntryDto;
					// Create the product
					const createdProduct = await tx
						.insert(products)
						.values(product)
						.returning();

					// Create the vendor
					const createdVendor = await tx
						.insert(vendors)
						.values(vendor)
						.returning();

					// Create the catalog entry
					catalogEntryData.productId = createdProduct[0].id;
					catalogEntryData.vendorId = createdVendor[0].id;
					const newEntry = await tx
						.insert(catalogEntries)
						.values(catalogEntryData)
						.returning();

					return newEntry;
				},
			);
			return newCatalogEntry[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create catalog request',
				);
			}
		}
	}

	findAll() {
		return `This action returns all catalogEntries`;
	}

	findOne(id: number) {
		return `This action returns a #${id} catalogEntry`;
	}

	update(id: number, updateCatalogEntryDto: UpdateCatalogEntryDto) {
		return `This action updates a #${id} catalogEntry`;
	}

	remove(id: number) {
		return `This action removes a #${id} catalogEntry`;
	}
}
