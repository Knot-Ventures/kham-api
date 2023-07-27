import { Global, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema/schema';
import * as process from 'process';

@Global()
@Injectable()
export class DrizzleService {
	db: NodePgDatabase<typeof schema>;
	private isInitialized = false;
	constructor() {
		this.initialize().then(() => {
			this.isInitialized = true;
		});
	}

	async initialize() {
		const {
			PGHOST,
			PGDATABASE,
			PGUSER,
			PGPASSWORD,
			PGPORT = '5432',
		} = process.env;

		const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=prefer`;
		try {
			// Create a client and connect to the database
			const client = new Client({
				connectionString,
			});
			await client.connect();

			// Create a Drizzle ORM instance with the client and your schema
			this.db = drizzle(client, { schema });

			// Test the connection with a query
			const result = await this.db.execute(sql`SELECT version()`);
			console.log(result.rows[0].version);
		} catch (e) {
			console.error(e);
		}
	}
}
