export {};
declare global {
	interface DbConfig {
		PGHOST: string;
		PGDATABASE: string;
		PGUSER: string;
		PGPASSWORD: string;
		ENDPOINT_ID: string;
		PGPORT: string;
	}
	interface EnvironmentVariables {
		FIREBASE_SERVICE_ACCOUNT: string;
		FIREBASE_WEB_API_KEY: string;

		SENDGRID_API_KEY: string;

		PGHOST: string;
		PGDATABASE: string;
		PGUSER: string;
		PGPASSWORD: string;
		ENDPOINT_ID: string;
		PGPORT: string;

		dbConfig: DbConfig;

		KHAM_DB: string;
	}

	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			FIREBASE_SERVICE_ACCOUNT: string;
			FIREBASE_WEB_API_KEY: string;

			SENDGRID_API_KEY: string;

			PGHOST: string;
			PGDATABASE: string;
			PGUSER: string;
			PGPASSWORD: string;
			ENDPOINT_ID: string;
			PGPORT: string;

			KHAM_DB: string;
		}
	}
}
