import {
	pgTable,
	serial,
	text,
	varchar,
	jsonb,
	doublePrecision,
	timestamp,
	integer,
	pgEnum,
} from 'drizzle-orm/pg-core';
import users_contact_info from './user_contact_info';
import providers from './providers';
import seekers from './seekers';
import { relations } from 'drizzle-orm';
import catalog_requests from './catalog_requests';
import users from './users';

export const adminRoleEnum = pgEnum('admin_role', [
	'administrator',
	'customer_service',
	'sales',
	'other',
]);

const adminAccess = pgTable('admin_access', {
	id: serial('id').primaryKey(),
	role: adminRoleEnum('user_type'),
	permissions: jsonb('permissions'),
});
export default adminAccess;
// export const adminAccessRelations = relations(adminAccess, ({ one, many }) => ({
// 	user: one(users, { references: [users.id], fields: [adminAccess.userId] }), // TODO flip definition to other side
// }));
