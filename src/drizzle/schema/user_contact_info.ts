import { boolean, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import users from './users';
import { GeoLocation } from '../../data/geolocation';

const userContactInfo = pgTable('user_contact_info', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.references(() => users.id)
		.notNull(),
	governorate: text('governorate'),
	city: text('city'),
	address: text('address'),
	phoneNumber: text('phone_number'),
	email: text('email'),
	location: jsonb('location').$type<GeoLocation>(),
	default: boolean('default').default(false),
});
export default userContactInfo;
export const userContactInfoRelations = relations(
	userContactInfo,
	({ one, many }) => ({
		user: one(users, {
			references: [users.id],
			fields: [userContactInfo.userId],
		}),
	}),
);
