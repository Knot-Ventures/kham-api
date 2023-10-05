import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { eq, or } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import catalogEntries from '../../drizzle/schema/catalog_entries';
import products from '../../drizzle/schema/products';
import vendors from '../../drizzle/schema/vendors';
import { handleServiceError } from '../utilities/error-handling.util';
import { CreateCatalogEntryDto } from './dto/create-catalog-entry.dto';
import { UpdateCatalogEntryDto } from './dto/update-catalog-entry.dto';
import {
	CatalogEntryEntity,
	CatalogEntryModel,
} from './entities/catalog-entry.entity';
import { FindAllCatalogEntriesResponseDto } from './dto/find-all-catalog-entries.response.dto';

@Injectable()
export class CatalogEntriesService {
	constructor(private readonly drizzleService: DrizzleService) {}

	async create(
		createCatalogEntryDto: CreateCatalogEntryDto,
	): Promise<CatalogEntryModel> {
		try {
			const newCatalogEntry = await this.drizzleService.db.transaction(
				async (tx) => {
					const { productData, vendorData, ...catalogEntryData } =
						createCatalogEntryDto;

					const { vendorId, productId } = catalogEntryData;
					const insertedEntryData: Required<typeof catalogEntryData> =
						{ ...catalogEntryData } as any;

					// Handle the product
					product: {
						if (productData) {
							// Create the product
							const createdProduct = await tx
								.insert(products)
								.values(productData)
								.returning();
							insertedEntryData.productId = createdProduct[0].id;
						} else if (productId) {
							// Find the product
							const productsResult = await tx
								.select()
								.from(products)
								.where(
									or(
										eq(products.id, productId),
										eq(products.identifier, productId),
									),
								);

							if (!productsResult?.[0]) {
								throw new BadRequestException(
									'unknown-product-id',
								);
							}
						} else {
							throw new BadRequestException(
								'product-data-missing-or-not-found',
							);
						}
					}

					//Handle the vendor
					vendor: {
						if (vendorData) {
							// Create the vendor
							const createdVendor = await tx
								.insert(vendors)
								.values(vendorData)
								.returning();
							insertedEntryData.vendorId = createdVendor[0].id;
						} else if (vendorId) {
							// Find the vendor
							const vendorsResult = await tx
								.select()
								.from(vendors)
								.where(eq(vendors.id, vendorId));

							if (!vendorsResult?.[0]) {
								throw new BadRequestException(
									'unknown-vendor-id',
								);
							}
						} else {
							throw new BadRequestException(
								'vendor-data-missing-or-not-found',
							);
						}
					}
					if (
						!(
							insertedEntryData.productId &&
							insertedEntryData.vendorId
						)
					) {
						throw new InternalServerErrorException();
					}
					return tx
						.insert(catalogEntries)
						.values(insertedEntryData)
						.returning();
				},
			);
			return newCatalogEntry[0];
		} catch (error) {
			handleServiceError(error, 'Failed to create Catalog Entry');
		}
	}

	//get All
	async findAll(
		page: number,
		limit: number,
	): Promise<FindAllCatalogEntriesResponseDto> {
		const offset = (page - 1) * limit;

		try {
			return {
				page,
				limit,
				data: await this.drizzleService.db
					.select()
					.from(catalogEntries)
					.limit(limit)
					.offset(offset),
			};
		} catch (error) {
			handleServiceError(error, 'Failed to get all Catalog Entry');
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
			handleServiceError(error, 'Failed get Catalog Entry');
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
			handleServiceError(error, 'Failed to update catalog Entry ');
		}
	}

	async remove(id: string): Promise<CatalogEntryEntity> {
		const catalogEntryExists = await this.drizzleService.db
			.select()
			.from(catalogEntries)
			.limit(1)
			.where(eq(catalogEntries.id, id));

		//TODO cancel all pending requests
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
			handleServiceError(error, 'Failed to remove catalog Entry ');
		}
	}
}
