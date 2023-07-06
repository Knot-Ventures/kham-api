import { doublePrecision, pgTable, serial } from 'drizzle-orm/pg-core';
import catalog_entries from './catalog_entries';
import { relations } from 'drizzle-orm';
import catalogEntries from './catalog_entries';
import catalogRequests from './catalog_requests';

const catalogRequestItems = pgTable('catalog_request_items', {
	id: serial('id').primaryKey(),
	catalog_entry_id: serial('catalog_entry_id').references(
		() => catalog_entries.id,
	),
	catalog_request_id: serial('catalog_request_id').references(
		() => catalogRequests.id,
	),
	quantity: doublePrecision('quantity'),
});

export default catalogRequestItems;
export const catalogRequestsItemsRelations = relations(
	catalogRequestItems,
	({ one, many }) => ({
		catalogEntry: one(catalogEntries, {
			fields: [catalogRequestItems.catalog_entry_id],
			references: [catalogEntries.id],
		}),
		catalogRequest: one(catalogRequests, {
			fields: [catalogRequestItems.catalog_request_id],
			references: [catalogRequests.id],
		}),
	}),
);
