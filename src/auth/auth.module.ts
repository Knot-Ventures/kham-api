import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase-auth-strategy.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { UsersModule } from '../resources/users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthController } from './auth.controller';

@Module({
	controllers: [AuthController],
	imports: [
		PassportModule.register({ defaultStrategy: 'firebase-jwt' }),
		UsersModule,
		FirebaseModule,
	],
	providers: [FirebaseAuthStrategy],
	exports: [PassportModule],
})
export class AuthModule {}
