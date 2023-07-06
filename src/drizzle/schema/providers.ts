import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import users from './users';
import seekers from './seekers';

const providers = pgTable('providers', {
	id: serial('id').primaryKey(),
	fullName: text('full_name'),
	phone: varchar('phone', { length: 256 }),
});
export default providers;

export const providersRelations = relations(providers, ({ one, many }) => ({
	users: many(users),
}));
