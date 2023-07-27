import { boolean, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import users from './users';

const userContactInfo = pgTable('user_contact_info', {
	id: uuid('id').defaultRandom().primaryKey(),
	governorate: text('governorate'),
	city: text('city'),
	address: text('address'),
	phoneNumber: text('phone_number'),
	email: text('email'),
	location: jsonb('location'),
	default: boolean('default').default(false),
});
export default userContactInfo;
export const userContactInfoRelations = relations(
	userContactInfo,
	({ one, many }) => ({
		user: one(users, {
			references: [users.contactInfoId],
			fields: [userContactInfo.id],
		}),
	}),
);
