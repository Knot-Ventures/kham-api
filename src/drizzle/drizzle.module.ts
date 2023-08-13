import { Global, Module } from "@nestjs/common";

import { DrizzleService } from './drizzle.service';


@Global()
@Module({
	controllers: [],
	providers: [DrizzleService],
	exports: [DrizzleService],
})
export class DrizzleModule {}
