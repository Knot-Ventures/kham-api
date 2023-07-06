import { Injectable } from '@nestjs/common';
import { Pool } from '@neondatabase/serverless';
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import * as schema from './schema/schema';

@Injectable()
export class DrizzleService {
	readonly db: NeonDatabase<typeof schema>;
	constructor() {
		const {
			PGHOST,
			PGDATABASE,
			PGUSER,
			PGPASSWORD,
			ENDPOINT_ID,
			PGPORT = '5432',
		} = process.env;
		const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

		const pool = new Pool({ connectionString: URL });

		pool.query(`select version()`).then((result) => {
			console.log(`PgSql::version = ${result}`);
		});
		this.db = drizzle(pool, { schema });
	}
}
