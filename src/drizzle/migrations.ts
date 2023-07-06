import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from 'postgres';

const {
	PGHOST,
	PGDATABASE,
	PGUSER,
	PGPASSWORD,
	ENDPOINT_ID,
	PGPORT = '5432',
} = process.env;

const sql = postgres({
	max: 1,
	ssl: 'prefer',
	host: PGHOST,
	database: PGDATABASE,
	user: PGUSER,
	password: PGPASSWORD,
	port: parseInt(PGPORT),
});
const db = drizzle(sql);
async function main() {
	await migrate(db, { migrationsFolder: 'drizzle' });
	return;
}
main();
