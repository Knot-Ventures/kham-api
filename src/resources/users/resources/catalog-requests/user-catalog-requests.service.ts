import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { DrizzleError, eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../../../../drizzle/drizzle.service';
import catalogRequestContactInfo from '../../../../drizzle/schema/catalog_request_contact_info';
import catalogRequests from '../../../../drizzle/schema/catalog_requests';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { SubmitCatalogRequestDto } from './dto/submit-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import {
	CatalogRequestModel,
	CatalogRequestStatusType,
} from './entities/catalog-request.entity';

@Injectable()
export class UserCatalogRequestsService {
	constructor(private readonly drizzleService: DrizzleService) {}

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
	} //return 201 status code

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

	findOne(id: number) {
		return `This action returns a #${id} catalogRequest`;
	}

	update(id: number, updateCatalogRequestDto: UpdateCatalogRequestDto) {
		return `This action updates a #${id} catalogRequest`;
	}

	remove(id: number) {
		return `This action removes a #${id} catalogRequest`;
	}
}
