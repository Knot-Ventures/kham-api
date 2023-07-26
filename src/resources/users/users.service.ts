/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DrizzleService } from '../../drizzle/drizzle.service';
import adminAccess from '../../drizzle/schema/admin_access';
import userContactInfo from '../../drizzle/schema/user_contact_info';
import users from '../../drizzle/schema/users';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminAccessDto } from './dto/createAdminAccess.dto';
import { CreateContactInfoDto } from './dto/createContactInfo.dto';
import { User } from './entities/user.entity';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) {}

	// Create a new user
	async createUser(
		userData: CreateUserDto,
		contactInfoData: CreateContactInfoDto,
		adminAccessData: CreateAdminAccessDto,
	): Promise<User> {
		try {
			const createdUser = await this.drizzleService.db.transaction(
				async (tx) => {
					const contactInfo = await tx
						.insert(userContactInfo)
						.values(contactInfoData)
						.returning();
					userData.contactInfoId = Number(contactInfo[0].id);
					const userAdminAccess = await tx
						.insert(adminAccess)
						.values(adminAccessData)
						.returning();
					userData.adminAccessId = Number(userAdminAccess[0].id);
					const user = await tx
						.insert(users)
						.values(userData)
						.returning();
					return user[0];
				},
			);

			return createdUser;
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					error: 'Failed to create user.',
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
