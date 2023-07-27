import { IsEnum } from 'class-validator';
import { AdminRole } from '../entities/admin-access.entity';

export class CreateAdminAccessDto {
	@IsEnum(AdminRole)
	role: AdminRole;
}
