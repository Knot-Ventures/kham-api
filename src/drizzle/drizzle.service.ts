import { Injectable } from '@nestjs/common';
import { neonConfig, Pool, neon } from '@neondatabase/serverless';
// import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless';
import {
	drizzle,
	NeonHttpDatabase as NeonDatabase,
} from 'drizzle-orm/neon-http';
import * as schema from './schema/schema';
import { sql } from 'drizzle-orm';
// import ws from 'ws';
// neonConfig.webSocketConstructor = ws;
neonConfig.fetchConnectionCache = true;

@Injectable()
export class DrizzleService {
	readonly db: NeonDatabase<typeof schema>;
	private pool: Pool;
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

		try {
			const sqlNeon = neon(URL);

			this.db = drizzle(sqlNeon, { schema });
			this.db
				.execute(sql`select version()`)
				.then((res) => console.log(res.rows[0]));
		} catch (e) {
			console.error(e);
		}
	}
}
