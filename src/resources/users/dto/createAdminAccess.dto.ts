import { IsEnum } from 'class-validator';
import { adminRoleEnum } from '../../../drizzle/schema/admin_access';

export class CreateAdminAccessDto {
	@IsEnum(adminRoleEnum)
	role: 'administrator' | 'customer_service' | 'sales' | 'other';
}
