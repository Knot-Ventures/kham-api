import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './resources/users/users.module';
import { DrizzleService } from './drizzle/drizzle.service';
import { CatalogEntriesModule } from './resources/catalog-entries/catalog-entries.module';
import { CatalogRequestsModule } from './resources/catalog-requests/catalog-requests.module';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		FirebaseModule,
		CatalogEntriesModule,
		CatalogRequestsModule,
	],
	controllers: [AppController],
	providers: [AppService, DrizzleService],
	exports: [],
})
export class AppModule {}
