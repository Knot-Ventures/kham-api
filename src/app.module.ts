import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DrizzleService } from './drizzle/drizzle.service';
import { FirebaseModule } from './firebase/firebase.module';
import { CatalogEntriesModule } from './resources/catalog-entries/catalog-entries.module';
import { CatalogRequestsModule } from './resources/catalog-requests/catalog-requests.module';
import { UsersModule } from './resources/users/users.module';

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
	exports: [DrizzleService],
})
export class AppModule {}
