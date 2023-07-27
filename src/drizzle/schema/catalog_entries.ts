import {
	doublePrecision,
	pgTable,
	text,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import products from './products';
import vendors from './vendors';
import { relations } from 'drizzle-orm';
import catalog_request_items from './catalog_request_items';

const catalogEntries = pgTable('catalog_entries', {
	id: uuid('id').defaultRandom().primaryKey(),
	productId: uuid('product_id')
		.notNull()
		.references(() => products.id),
	vendorId: uuid('vendor_id')
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
