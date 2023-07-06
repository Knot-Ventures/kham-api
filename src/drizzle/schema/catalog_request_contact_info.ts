import { jsonb, pgTable, serial, text } from 'drizzle-orm/pg-core';

const catalogRequestContactInfo = pgTable('catalog_request_contact_info', {
	id: serial('id').primaryKey(),
	governorate: text('governorate'),
	city: text('city'),
	address: text('address'),
	phoneNumber: text('phone_number'),
	email: text('email'),
	location: jsonb('location'),
});
export default catalogRequestContactInfo;
