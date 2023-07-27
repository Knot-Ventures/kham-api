import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import catalogEntries from './catalog_entries';

const products = pgTable('products', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: varchar('name', { length: 256 }),
	eNumber: varchar('e_number', { length: 6 }),
	otherNames: text('other_names'),
	uses: text('uses'),
});

export default products;
export const productsRelations = relations(products, ({ one, many }) => ({
	catalogEntries: many(catalogEntries),
}));
