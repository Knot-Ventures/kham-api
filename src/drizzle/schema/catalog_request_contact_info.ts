import { jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

const catalogRequestContactInfo = pgTable('catalog_request_contact_info', {
	id: uuid('id').defaultRandom().primaryKey(),
	governorate: text('governorate'),
	city: text('city'),
	address: text('address'),
	phoneNumber: text('phone_number'),
	email: text('email'),
	location: jsonb('location'),
});
export default catalogRequestContactInfo;
