import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DrizzleError, and, eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../../../../drizzle/drizzle.service';
import catalogRequestContactInfo from '../../../../drizzle/schema/catalog_request_contact_info';
import catalogRequestItems from '../../../../drizzle/schema/catalog_request_items';
import catalogRequests from '../../../../drizzle/schema/catalog_requests';
import { CreateCatalogRequestItemDto } from './dto/create-catalog-request-item.dto';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { ItemsDto } from './dto/items.dto';
import { SubmitCatalogRequestDto } from './dto/submit-catalog-request.dto';
import { UpdateCatalogRequestItemDto } from './dto/update-catalog-request-item.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import { UpdateItemCountDto } from './dto/update-item-count.dto';
import { CatalogRequestItemsModel } from './entities/catalog-request-item.entity';
import {
	CatalogRequestEntity,
	CatalogRequestModel,
	CatalogRequestStatusType,
} from './entities/catalog-request.entity';

@Injectable()
export class UserCatalogRequestsService {
	constructor(private readonly drizzleService: DrizzleService) {}
	//create
	async create(
		createCatalogRequestDto: CreateCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		try {
			const createdCatalogRequest =
				await this.drizzleService.db.transaction(async (tx) => {
					// Create the contact info first
					const { requestContactInfo, ...catalogRequestData } =
						createCatalogRequestDto;
					const contactInfo = await tx
						.insert(catalogRequestContactInfo)
						.values(requestContactInfo)
						.returning();
					if (!contactInfo || contactInfo.length === 0) {
						throw new InternalServerErrorException(
							'Failed to create catalog request contact info',
						);
					}

					catalogRequestData.requestContactInfoId = contactInfo[0].id;
					catalogRequestData.status = CatalogRequestStatusType.Parked;
					catalogRequestData.createdAt = new Date();

					const catalogRequest = await tx
						.insert(catalogRequests)
						.values(catalogRequestData)
						.returning();

					if (!catalogRequest || catalogRequest.length === 0) {
						throw new InternalServerErrorException(
							'Failed to create catalog request',
						);
					}
					// Combine contactInfo and catalogRequest into a single object

					return catalogRequest[0];
				});
			return createdCatalogRequest;
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
	//submit
	async submit(
		submitCatalogRequestData: SubmitCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		const { id, status, notes } = submitCatalogRequestData;

		try {
			// Fetch the catalog request to be submitted
			const catalogRequest = (
				await this.drizzleService.db
					.select({
						count: sql<number>`count(${catalogRequests.id})`,
					})
					.from(catalogRequests)
					.limit(1)
					.where(eq(catalogRequests.id, id))
			)?.[0]?.count;
			if (!catalogRequest) {
				throw new HttpException(
					{
						status: HttpStatus.NOT_FOUND,
						error: 'Catalog request not found.',
					},
					HttpStatus.NOT_FOUND,
				);
			}

			// Update the catalog request with the submitted data
			const updatedCatalogRequest = await this.drizzleService.db
				.update(catalogRequests)
				.set({ status, notes, respondedAt: new Date() })
				.where(eq(catalogRequests.id, id))
				.returning();

			return updatedCatalogRequest[0];
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
	//get All
	async findAll(page: number, limit: number): Promise<CatalogRequestModel[]> {
		const offset = (page - 1) * limit;

		try {
			return this.drizzleService.db
				.select()
				.from(catalogRequests)
				.limit(limit)
				.offset(offset);
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
	//get by Id
	async findOne(id: string): Promise<CatalogRequestEntity> {
		try {
			const catalogRequest =
				await this.drizzleService.db.query.catalogRequests.findFirst({
					where: eq(catalogRequests.id, id),
					with: {
						requestContactInfo: true,
					},
				});

			if (!catalogRequest) {
				throw new NotFoundException(
					`Catalog request with ID ${id} not found`,
				);
			}

			return catalogRequest;
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
	//update
	async update(
		id: string,
		updateCatalogRequestDto: UpdateCatalogRequestDto,
	): Promise<CatalogRequestModel> {
		const catalogRequestExists = (
			await this.drizzleService.db
				.select({ count: eq(catalogRequests.id, id) })
				.from(catalogRequests)
		)?.[0]?.count;

		if (
			typeof catalogRequestExists === 'number' &&
			catalogRequestExists <= 0
		) {
			throw new NotFoundException(
				`Catalog request with ID ${id} not found`,
			);
		}

		try {
			// Update the catalog request data
			const updatedCatalogRequest = await this.drizzleService.db
				.update(catalogRequests)
				.set(updateCatalogRequestDto)
				.where(eq(catalogRequests.id, id))
				.returning();

			if (!updatedCatalogRequest[0]) {
				throw new Error('Failed to update catalog request');
			}

			return updatedCatalogRequest[0];
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
	//add item to catalogRequestItem
	async addItemsToRequest(
		requestId: string,
		createCatalogRequestItemDto: CreateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		try {
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.where(eq(catalogRequests.id, requestId))
				.limit(1);

			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`Catalog request with ID ${requestId} not found`,
				);
			}

			// Create a new catalog request item
			const newItem = await this.drizzleService.db
				.insert(catalogRequestItems)
				.values({
					...createCatalogRequestItemDto,
					catalog_request_id: requestId,
				})
				.returning();

			return newItem[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to add item to catalogRequestItem',
				);
			}
		}
	}
	//add item to otherItems in catalog request
	async addItems(
		requestId: string,
		addItemsDto: ItemsDto,
	): Promise<CatalogRequestModel> {
		try {
			// Check if the request exists
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.limit(1)
				.where(eq(catalogRequests.id, requestId));
			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`request with ID ${requestId} not found`,
				);
			}

			const otherItemsArray = catalogRequest[0].otherItems as any[];
			otherItemsArray.push(...addItemsDto.items);

			const updated = await this.drizzleService.db
				.update(catalogRequests)
				.set({ otherItems: otherItemsArray })
				.where(eq(catalogRequests.id, requestId))
				.returning();
			return updated[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to add item',
				);
			}
		}
	}
	//removeItemsFromRequest
	async removeItemsFromRequest(
		requestId: string,
	): Promise<CatalogRequestItemsModel> {
		try {
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.where(eq(catalogRequests.id, requestId))
				.limit(1);

			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`Catalog request with ID ${requestId} not found`,
				);
			}

			// Remove items associated with the catalog request
			const removedItems = await this.drizzleService.db
				.delete(catalogRequestItems)
				.where(eq(catalogRequestItems.catalog_request_id, requestId))
				.returning();

			return removedItems[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to remove items from catalog request',
				);
			}
		}
	}

	//remove item from otherItems in catalog request
	async removeItems(
		requestId: string,
		removeItemsDto: ItemsDto,
	): Promise<CatalogRequestModel> {
		try {
			// Check if the request exists
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.limit(1)
				.where(eq(catalogRequests.id, requestId));

			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`Request with ID ${requestId} not found.`,
				);
			}

			// Filter out the items to remove
			const otherItemsArray = (
				catalogRequest[0].otherItems as string[]
			).filter((item) => !removeItemsDto.items.includes(item));

			// Update the catalog request in the database
			const updated = await this.drizzleService.db
				.update(catalogRequests)
				.set({ otherItems: otherItemsArray })
				.where(eq(catalogRequests.id, requestId))
				.returning();

			return updated[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to remove items from catalog request',
				);
			}
		}
	}

	//updateItemQuantity
	async updateItemQuantity(
		requestId: string,
		itemId: string,
		updateItemDto: UpdateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		try {
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.where(eq(catalogRequests.id, requestId))
				.limit(1);

			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`Catalog request with ID ${requestId} not found`,
				);
			}

			// Check if the catalog request item exists and update its quantity
			const updatedItem = await this.drizzleService.db
				.update(catalogRequestItems)
				.set({ quantity: updateItemDto.quantity })
				.where(eq(catalogRequestItems.catalog_request_id, requestId))
				.returning();

			if (!updatedItem[0]) {
				throw new NotFoundException(
					`Item with ID ${itemId} not found in the catalog request`,
				);
			}

			return updatedItem[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to update item count for catalog request',
				);
			}
		}
	}

	async updateItemCount(
		requestId: string,
		updateItemCountDto: UpdateItemCountDto,
	): Promise<CatalogRequestModel> {
		try {
			// Check if the request exists
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.limit(1)
				.where(eq(catalogRequests.id, requestId));

			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`Request with ID ${requestId} not found.`,
				);
			}

			// Update the catalog request's item count in the database
			const updated = await this.drizzleService.db
				.update(catalogRequests)
				.set({ itemCount: updateItemCountDto.itemCount })
				.where(eq(catalogRequests.id, requestId))
				.returning();

			return updated[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to update item count for catalog request',
				);
			}
		}
	}

	//delete
	async cancelCatalogRequest(requestId: string) {
		try {
			// Check if the request exists and is pending
			const catalogRequest = await this.drizzleService.db
				.select()
				.from(catalogRequests)
				.limit(1)
				.where(
					and(
						eq(catalogRequests.id, requestId),
						eq(
							catalogRequests.status,
							CatalogRequestStatusType.Parked,
						),
					),
				);

			if (!catalogRequest[0]) {
				throw new NotFoundException(
					`Request with ID ${requestId} not found or not pending.`,
				);
			}

			// Delete the catalog request
			const deletedRequest = await this.drizzleService.db
				.delete(catalogRequests)
				.where(eq(catalogRequests.id, requestId))
				.returning();

			return deletedRequest[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to cancel and remove catalog request.',
				);
			}
		}
	}
}
