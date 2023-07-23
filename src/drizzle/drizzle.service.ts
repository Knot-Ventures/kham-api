import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema/schema';

@Injectable()
export class DrizzleService {
	db;
	constructor() {
		this.initialize();
	}

	async initialize() {
		const {
			PGHOST,
			PGDATABASE,
			PGUSER,
			PGPASSWORD,
			PGPORT = '5432',
		} = process.env;

		const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;

		try {
			// Create a PostgreSQL client and connect to the database
			const client = new Client({ connectionString });
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
