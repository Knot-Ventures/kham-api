import { IsEnum } from 'class-validator';

export enum AdminRole {
	Administrator = 'administrator',
	CustomerService = 'customer_service',
	Sales = 'sales',
	Other = 'other',
}

export class CreateAdminAccessDto {
	@IsEnum(AdminRole)
	role: AdminRole;
}
