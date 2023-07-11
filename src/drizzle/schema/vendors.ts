import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import catalogEntries from './catalog_entries';

const vendors = pgTable('vendors', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 256 }),
	address: text('address'),
	image: varchar('image', { length: 256 }),
});
export default vendors;
export const vendorsRelations = relations(vendors, ({ one, many }) => ({
	catalogEntries: many(catalogEntries),
}));
