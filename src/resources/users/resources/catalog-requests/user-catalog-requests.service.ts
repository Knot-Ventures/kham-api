import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { and, DrizzleError, eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../../../../drizzle/drizzle.service';
import catalogRequestContactInfo from '../../../../drizzle/schema/catalog_request_contact_info';
import catalogRequests from '../../../../drizzle/schema/catalog_requests';
import { handleServiceError } from '../../../utilities/error-handling.util';
import { CreateUserCatalogRequestDto } from './dto/requests/create-user-catalog-request.dto';
import { SubmitUserCatalogRequestDto } from './dto/requests/submit-user-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/requests/update-catalog-request.dto';
import { FindAllCatalogRequestsResponseDto } from './dto/responses/find-all-catalog-requests.response.dto';
import {
	CatalogRequestEntity,
	CatalogRequestStatusType,
} from './entities/catalog-request.entity';

@Injectable()
export class UserCatalogRequestsService {
	constructor(private readonly drizzleService: DrizzleService) {}
	//create
	async create(
		userId: string,
		catalogRequestData: CreateUserCatalogRequestDto,
	): Promise<CatalogRequestEntity> {
		try {
			const createdCatalogRequest = await this.drizzleService.db
				.insert(catalogRequests)
				.values({
					userId,
					...catalogRequestData,
					status: CatalogRequestStatusType.Parked,
					createdAt: new Date(),
				})
				.returning();

			if (!createdCatalogRequest || createdCatalogRequest.length === 0) {
				throw new InternalServerErrorException(
					'Failed to create catalog request',
				);
			}
			return createdCatalogRequest[0];
		} catch (error) {
			handleServiceError(error, 'Failed to create catalog request');
		}
	}

	//submit
	async submit(
		userId: string,
		requestId: string,
		submitCatalogRequestData: SubmitUserCatalogRequestDto,
	): Promise<CatalogRequestEntity> {
		const { requestContactInfo, status, notes } = submitCatalogRequestData;

		try {
			return this.drizzleService.db.transaction(async (tx) => {
				// Fetch the catalog request to be submitted
				const catalogRequest = (
					await tx
						.select({
							count: sql<number>`count(${catalogRequests.id})`,
						})
						.from(catalogRequests)
						.limit(1)
						.where(eq(catalogRequests.id, requestId))
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

				// Create the contact info

				const contactInfo = await tx
					.insert(catalogRequestContactInfo)
					.values(requestContactInfo)
					.returning();
				if (!contactInfo || contactInfo.length === 0) {
					throw new InternalServerErrorException(
						'Failed to create catalog request contact info',
					);
				}

				// Update the catalog request with the submitted data
				const updatedCatalogRequest = await tx
					.update(catalogRequests)
					.set({
						status,
						notes,
						submittedAt: new Date(),
						requestContactInfoId: contactInfo[0].id,
					})
					.where(eq(catalogRequests.id, requestId))
					.returning();

				const createdCatalogRequest = await tx
					.insert(catalogRequests)
					.values({
						userId: userId,
						status: CatalogRequestStatusType.Parked,
						createdAt: new Date(),
					})
					.returning();

				if (
					!createdCatalogRequest ||
					createdCatalogRequest.length === 0
				) {
					throw new InternalServerErrorException(
						'Failed to create a new catalog request',
					);
				}

				return updatedCatalogRequest[0];
			});
		} catch (error) {
			handleServiceError(error, 'Failed to submit catalog request');
		}
	}

	//get All
	async findAll(
		page: number,
		limit: number,
	): Promise<FindAllCatalogRequestsResponseDto> {
		const offset = (page - 1) * limit;

		try {
			return {
				data: await this.drizzleService.db
					.select()
					.from(catalogRequests)
					.limit(limit)
					.offset(offset),
				limit,
				page,
			};
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
			handleServiceError(error, 'Failed to create catalog request');
		}
	}

	//update
	async update(
		id: string,
		updateCatalogRequestDto: UpdateCatalogRequestDto,
	): Promise<CatalogRequestEntity> {
		const catalogRequestExists = (
			await this.drizzleService.db
				.select({
					count: eq(catalogRequests.id, id),
				})
				.from(catalogRequests)
				.where(
					eq(catalogRequests.status, CatalogRequestStatusType.Parked),
				)
		)?.[0]?.count;

		if (
			typeof catalogRequestExists === 'number' &&
			catalogRequestExists <= 0
		) {
			throw new NotFoundException(
				`Catalog request with ID ${id} not found or not editable`,
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
			handleServiceError(error, 'Failed to update catalog request');
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
							CatalogRequestStatusType.PendingResponse,
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
				.update(catalogRequests)
				.set({
					status: CatalogRequestStatusType.Canceled,
				})
				.where(eq(catalogRequests.id, requestId))
				.returning();

			return deletedRequest[0];
		} catch (error) {
			handleServiceError(error, 'Failed to delete catalogRequest');
		}
	}
}
