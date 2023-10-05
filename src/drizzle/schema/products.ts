import { pgEnum, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import catalogEntries from './catalog_entries';

export const productIdentifierType = pgEnum('product_identifier_type', [
	'e_number',
	'other',
]);

const products = pgTable('products', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 256 }),
	identifier: varchar('identifier', { length: 6 }),
	identifierType: productIdentifierType('identifier_type'),
	otherNames: text('other_names').array(),
	uses: text('uses').array(),
});

export default products;
export const productsRelations = relations(products, ({ one, many }) => ({
	catalogEntries: many(catalogEntries),
}));
