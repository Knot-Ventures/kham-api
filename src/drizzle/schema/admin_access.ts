import { jsonb, pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core';

export const adminRoleEnum = pgEnum('admin_role', [
	'administrator',
	'customer_service',
	'sales',
	'other',
]);

const adminAccess = pgTable('admin_access', {
	id: uuid('id').defaultRandom().primaryKey(),
	role: adminRoleEnum('user_type'),
	permissions: jsonb('permissions'),
});
export default adminAccess;
// export const adminAccessRelations = relations(adminAccess, ({ one, many }) => ({
// 	user: one(users, { references: [users.id], fields: [adminAccess.userId] }), // TODO flip definition to other side
// }));
