import { InferModel } from 'drizzle-orm';
import adminAccess from '../../../drizzle/schema/admin_access';
import { EnumTypeFromMap } from '../../../helpers/EnumTypeFromMap';
import { ApiProperty } from '@nestjs/swagger';

export const AdminRole = {
	Administrator: 'administrator',
	CustomerService: 'customer_service',
	Sales: 'sales',
	Other: 'other',
} as const;

export type AdminRole = EnumTypeFromMap<typeof AdminRole>;

export type AdminAccessModel = InferModel<typeof adminAccess>;

export class AdminAccessEntity implements AdminAccessModel {
	@ApiProperty()
	id: string;
	@ApiProperty({ enum: AdminRole })
	role: AdminRole;
	@ApiProperty()
	permissions: any;
}
