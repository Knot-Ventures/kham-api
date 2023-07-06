import {
	doublePrecision,
	pgTable,
	serial,
	text,
	varchar,
} from 'drizzle-orm/pg-core';
import products from './products';
import vendors from './vendors';
import { relations } from 'drizzle-orm';
import seekers from './seekers';
import providers from './providers';
import users_contact_info from './user_contact_info';
import catalog_requests from './catalog_requests';
import catalog_request_items from './catalog_request_items';
import users from './users';

const catalogEntries = pgTable('catalog_entries', {
	id: serial('id').primaryKey(),
	productId: serial('product_id')
		.notNull()
		.references(() => products.id),
	vendorId: serial('vendor_id')
		.notNull()
		.references(() => vendors.id),
	description: text('description'),
	images: varchar('images', { length: 256 }).array(),
	title: varchar('title', { length: 256 }),
	subtitle: varchar('subtitle', { length: 256 }),
	min_qty: doublePrecision('min_qty'),
	available_qty: doublePrecision('available_qty'),
	unit: varchar('unit', { length: 16 }),
	average_market_price: doublePrecision('average_market_price'),
});
export default catalogEntries;

export const catalogEntriesRelations = relations(
	catalogEntries,
	({ one, many }) => ({
		product: one(products, {
			fields: [catalogEntries.productId],
			references: [products.id],
		}),
		vendor: one(vendors, {
			fields: [catalogEntries.vendorId],
			references: [vendors.id],
		}),
		catalogRequestItems: many(catalog_request_items),
	}),
);
