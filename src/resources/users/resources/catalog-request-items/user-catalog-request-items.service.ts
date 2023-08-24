import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DrizzleService } from '../../../../drizzle/drizzle.service';
import catalogRequestItems from '../../../../drizzle/schema/catalog_request_items';
import catalogRequests from '../../../../drizzle/schema/catalog_requests';
import { handleServiceError } from '../../../utilities/error-handling.util';
import { CreateCatalogRequestItemDto } from './dto/create-catalog-request-item.dto';
import { UpdateCatalogRequestItemDto } from './dto/update-catalog-request-item.dto';
import { CatalogRequestItemsModel } from './entities/catalog-request-item.entity';
import { CatalogRequestStatusType } from '../catalog-requests/entities/catalog-request.entity';
import { CatalogRequestEntity } from '../../../catalog-requests/entities/catalog-request.entity';

@Injectable()
export class UserCatalogRequestItemsService {
	constructor(private readonly drizzleService: DrizzleService) {}

	//add item to catalogRequestItem
	async addItemsToRequest(
		requestId: string,
		createCatalogRequestItemDto: CreateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		const catalogRequest = await this.verifyParkedRequest({
			requestId,
		});
		try {
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
			handleServiceError(
				error,
				'Failed to add item to catalogRequestItem',
			);
		}
	}

	//removeItemsFromRequest
	async removeItemFromRequest(
		requestId: string,
		itemId: string,
	): Promise<CatalogRequestItemsModel> {
		const catalogRequest = await this.verifyParkedRequest({
			requestId,
		});
		try {
			// Remove items associated with the catalog request
			const removedItems = await this.drizzleService.db
				.delete(catalogRequestItems)
				.where(eq(catalogRequestItems.id, itemId))
				.returning();

			return removedItems[0];
		} catch (error) {
			handleServiceError(error, 'Failed to remove item');
		}
	}

	//removeItemsFromRequest
	async clearItemsFromRequest(
		requestId: string,
	): Promise<CatalogRequestItemsModel> {
		const catalogRequest = await this.verifyParkedRequest({
			requestId,
		});

		try {
			// Remove items associated with the catalog request
			const removedItems = await this.drizzleService.db
				.delete(catalogRequestItems)
				.where(eq(catalogRequestItems.catalog_request_id, requestId))
				.returning();

			return removedItems[0];
		} catch (error) {
			handleServiceError(error, 'Failed to remove item');
		}
	}

	//updateItemQuantity
	async updateItemQuantity(
		requestId: string,
		itemId: string,
		updateItemDto: UpdateCatalogRequestItemDto,
	): Promise<CatalogRequestItemsModel> {
		const catalogRequest = await this.verifyParkedRequest({ requestId });
		try {
			// Check if the catalog request item exists and update its quantity
			const updatedItem = await this.drizzleService.db
				.update(catalogRequestItems)
				.set({ quantity: updateItemDto.quantity })
				.where(
					and(
						eq(catalogRequestItems.catalog_request_id, requestId),
						eq(catalogRequestItems.id, itemId),
					),
				)
				.returning();

			if (!updatedItem[0]) {
				throw new NotFoundException(
					`Item with ID ${itemId} not found in the catalog request`,
				);
			}

			return updatedItem[0];
		} catch (error) {
			handleServiceError(error, 'Failed to update item count');
		}
	}

	async verifyParkedRequest({
		requestId,
	}: {
		requestId: string;
	}): Promise<CatalogRequestEntity> {
		const catalogRequest = await this.drizzleService.db
			.select()
			.from(catalogRequests)
			.where(
				and(
					eq(catalogRequests.id, requestId),
					eq(catalogRequests.status, CatalogRequestStatusType.Parked),
				),
			)
			.limit(1);

		if (!catalogRequest[0]) {
			throw new NotFoundException(
				`Catalog request with ID ${requestId} not found or not editable`,
			);
		}
		return catalogRequest[0];
	}
}
