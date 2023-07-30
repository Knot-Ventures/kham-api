import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env', override: false });

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const config: Config = {
	schema: './src/drizzle/schema/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		host: PGHOST,
		user: PGUSER,
		password: PGPASSWORD,
		database: PGDATABASE,
		ssl: false,
	},
};
export default config;
