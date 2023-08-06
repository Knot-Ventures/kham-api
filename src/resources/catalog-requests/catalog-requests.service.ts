import {
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DrizzleError, eq } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import catalogRequestContactInfo from '../../drizzle/schema/catalog_request_contact_info';
import catalogRequests from '../../drizzle/schema/catalog_requests';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import {
	CatalogRequestEntity,
	CatalogRequestStatusType,
} from './entities/catalog-request.entity';

@Injectable()
export class CatalogRequestsService {
	constructor(
		@Inject(DrizzleService) private readonly drizzleService: DrizzleService,
	) {}

	//create catalog request
	async create(
		createCatalogRequestDto: CreateCatalogRequestDto,
	): Promise<CatalogRequestEntity> {
		try {
			const createdCatalogRequest =
				await this.drizzleService.db.transaction(async (tx) => {
					// Create the contact info first
					const { requestContactInfo, ...catalogRequestData } =
						createCatalogRequestDto;
					if (!catalogRequestData.requestContactInfoId) {
						const contactInfo = await tx
							.insert(catalogRequestContactInfo)
							.values(requestContactInfo)
							.returning();
						if (!contactInfo || contactInfo.length === 0) {
							throw new InternalServerErrorException(
								'Failed to create catalog request contact info',
							);
						} else {
							catalogRequestData.requestContactInfoId =
								contactInfo[0].id;
						}
					}

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

	async findAll(
		page: number,
		limit: number,
	): Promise<CatalogRequestEntity[]> {
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

	async findOne(id: string): Promise<CatalogRequestEntity> {
		try {
			const catalogRequest =
				await this.drizzleService.db.query.catalogRequests.findFirst({
					where: eq(catalogRequests.id, id),
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

	update(id: number, updateCatalogRequestDto: UpdateCatalogRequestDto) {
		return `This action updates a #${id} catalogRequest`;
	}

	remove(id: number) {
		return `This action removes a #${id} catalogRequest`;
	}
}
