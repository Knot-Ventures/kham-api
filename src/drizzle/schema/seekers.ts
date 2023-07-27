import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import users from './users';

const seekers = pgTable('seekers', {
	id: uuid('id').defaultRandom().primaryKey(),
	fullName: text('full_name'),
	phone: varchar('phone', { length: 256 }),
});
export default seekers;
export const seekersRelations = relations(seekers, ({ one, many }) => ({
	users: many(users),
}));
