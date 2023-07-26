/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import adminAccess from '../../drizzle/schema/admin_access';
import userContactInfo from '../../drizzle/schema/user_contact_info';
import users from '../../drizzle/schema/users';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) {}

	// Create a new user with contactInfo and Admin Access
	async createUser(Data: UserDto): Promise<User> {
		try {
			const createdUser = await this.drizzleService.db.transaction(
				async (tx) => {
					const { contactInfoData, adminAccessData, userData } = Data;
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
					return user;
				},
			);
			return createdUser;
		} catch (error) {
			throw new HttpException(
				{
					status:
						error.response.status ||
						HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.response.error || 'Something went wrong.',
				},
				error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Create a user without contact info and admin access
	async createOne(userData: CreateUserDto): Promise<User> {
		try {
			const createdUser = await this.drizzleService.db
				.insert(users)
				.values(userData)
				.returning();

			if (!createdUser || createdUser.length === 0) {
				throw new HttpException(
					{
						status: HttpStatus.INTERNAL_SERVER_ERROR,
						error: 'Failed to create user.',
					},
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}

			return createdUser[0];
		} catch (error) {
			throw new HttpException(
				{
					status:
						error.response.status ||
						HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.response.error || 'Failed to create user.',
				},
				error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Find all users with pagination
	async findAll(page: number, limit: number): Promise<User[]> {
		const offset = (page - 1) * limit;

		try {
			return this.drizzleService.db
				.select()
				.from(users)
				.limit(limit)
				.offset(offset);
		} catch (error) {
			throw new HttpException(
				{
					status:
						error.response.status ||
						HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.response.error || 'Failed to fetch users.',
				},
				error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	// Find a user by ID
	async findOne(userId: number): Promise<any> {
		try {
			const user = await this.drizzleService.db.query.users.findFirst({
				where: eq(users.id, userId),
				with: {
					contactInfo: true,
					adminAccess: true,
				},
			});

			if (!user) {
				throw new HttpException(
					{
						status: HttpStatus.NOT_FOUND,
						error: 'User not found.',
					},
					HttpStatus.NOT_FOUND,
				);
			}

			return user;
		} catch (error) {
			throw new HttpException(
				{
					status:
						error.response.status ||
						HttpStatus.INTERNAL_SERVER_ERROR,
					error: error.response.error || 'Failed to fetch user.',
				},
				error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
