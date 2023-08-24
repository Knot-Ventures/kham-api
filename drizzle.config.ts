import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config({ path: '.env', override: false });

const {
	PGHOST,
	PGDATABASE,
	PGUSER,
	PGPASSWORD,
	ENDPOINT_ID,
	PGPORT = '5432',
} = process.env;
const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=prefer`;

const config: Config = {
	schema: './src/drizzle/schema/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString,
	},
};
export default config;
