import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DrizzleError, eq } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import catalogEntries from '../../drizzle/schema/catalog_entries';
import products from '../../drizzle/schema/products';
import vendors from '../../drizzle/schema/vendors';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
import { UpdateCatalogEntryDto } from './dto/update-catalog-entry.dto';
import {
	CatalogEntryEntity,
	CatalogEntryModel,
} from './entities/catalog-entry.entity';

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
						'Failed to create catalog entry',
				);
			}
		}
	}

	//get All
	async findAll(page: number, limit: number): Promise<CatalogEntryEntity[]> {
		const offset = (page - 1) * limit;

		try {
			return this.drizzleService.db
				.select()
				.from(catalogEntries)
				.limit(limit)
				.offset(offset);
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to get All catalog entry',
				);
			}
		}
	}

	//findById
	async findOne(id: string): Promise<CatalogEntryEntity> {
		try {
			const catalogEntry =
				await this.drizzleService.db.query.catalogEntries.findFirst({
					where: eq(catalogEntries.id, id),
					with: {
						product: true,
						vendor: true,
					},
				});

			if (!catalogEntry) {
				throw new NotFoundException(
					`Catalog Entry with ID ${id} not found`,
				);
			}

			return catalogEntry;
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to find catalog entry',
				);
			}
		}
	}

	//update
	async update(
		id: string,
		updateCatalogEntryDto: UpdateCatalogEntryDto,
	): Promise<CatalogEntryEntity> {
		const catalogEntryExists = (
			await this.drizzleService.db
				.select({ count: eq(catalogEntries.id, id) })
				.from(catalogEntries)
		)?.[0]?.count;

		if (typeof catalogEntryExists === 'number' && catalogEntryExists <= 0) {
			throw new NotFoundException(
				`Catalog entry with ID ${id} not found`,
			);
		}

		try {
			// Update the catalog entry data
			const updatedCatalogEntry = await this.drizzleService.db
				.update(catalogEntries)
				.set(updateCatalogEntryDto)
				.where(eq(catalogEntries.id, id))
				.returning();

			if (!updatedCatalogEntry[0]) {
				throw new Error('Failed to update catalog Entry');
			}

			return updatedCatalogEntry[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to update catalog entry',
				);
			}
		}
	}

	async remove(id: string): Promise<CatalogEntryEntity> {
		const catalogEntryExists = await this.drizzleService.db
			.select()
			.from(catalogEntries)
			.limit(1)
			.where(eq(catalogEntries.id, id));

		if (!catalogEntryExists[0]) {
			throw new NotFoundException(
				`Catalog Entry with ID ${id} not found`,
			);
		}

		try {
			const removedCatalog = await this.drizzleService.db
				.update(catalogEntries)
				.set({ isRemoved: true })
				.where(eq(catalogEntries.id, id))
				.returning();
			return removedCatalog[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to remove catalog entry from rotation',
				);
			}
		}
	}
}
