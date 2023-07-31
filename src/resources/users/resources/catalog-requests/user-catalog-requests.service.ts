import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DrizzleError } from 'drizzle-orm';
import { DrizzleService } from '../../../../drizzle/drizzle.service';
import catalogRequestContactInfo from '../../../../drizzle/schema/catalog_request_contact_info';
import catalogRequests from '../../../../drizzle/schema/catalog_requests';
import { CreateCatalogRequestDto } from './dto/create-catalog-request.dto';
import { SubmitCatalogRequestDto } from './dto/submit-catalog-request.dto';
import { UpdateCatalogRequestDto } from './dto/update-catalog-request.dto';
import {
	CatalogRequestEntity,
	CatalogRequestStatusType,
} from './entities/catalog-request.entity';

@Injectable()
export class UserCatalogRequestsService {
	constructor(private readonly drizzleService: DrizzleService) {}

	async create(
		createCatalogRequestDto: CreateCatalogRequestDto,
	): Promise<CatalogRequestEntity> {
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
					const result = {
						...catalogRequest[0],
						requestContactInfo: contactInfo[0],
					};

					return result;
				});
			console.log(createdCatalogRequest);
			return createdCatalogRequest[0];
		} catch (error) {
			console.log(error);
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

	submit(submitCatalogRequestDto: SubmitCatalogRequestDto) {
		return 'This action adds a new catalogRequest';
	}

	findAll() {
		return `This action returns all catalogRequests`;
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
