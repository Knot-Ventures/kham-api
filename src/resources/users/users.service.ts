/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import adminAccess from '../../drizzle/schema/admin_access';
import userContactInfo from '../../drizzle/schema/user_contact_info';
import users from '../../drizzle/schema/users';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminAccessDto } from './dto/createAdminAccess.dto';
import { CreateContactInfoDto } from './dto/createContactInfo.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';

@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) {}

	// Get the count of users by id (check existing user)
	private async userIdExists(id: number): Promise<void> {
		const existingUser = await this.drizzleService.db
			.select()
			.from(users)
			.where(eq(users.id, id));

		if (!existingUser[0]) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
	}

	// Create a new user
	async createUser(
		userData: CreateUserDto,
		contactInfoData: CreateContactInfoDto,
		adminAccessData: CreateAdminAccessDto,
	) {
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
			throw error;
		}
	}

	// Find all users with pagination
	async findAll(page: number, limit: number) {
		// Get total count of users
		const totalUsers = await this.drizzleService.db.select().from(users);
		const totalCount = totalUsers.length;
		const totalPages = Math.ceil(totalCount / limit);

		// Pagination query
		const result = await this.drizzleService.db
			.select()
			.from(users)
			.limit(limit)
			.offset((page - 1) * limit);

		return {
			totalPages,
			users: result,
		};
	}

	// Find one user by id
	async findOne(id: number) {
		const result = this.userIdExists(id);
		return result;
	}

	// Update user data
	async updateUser(id: number, userData: UpdateUserDto) {
		const userExists = (
			await this.drizzleService.db
				.select({ count: sql<number>`count(${users.id})` })
				.from(users)
				.limit(1)
				.where(eq(users.id, id))
		)?.[0]?.count;

		if (!userExists) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		// Update the user's data
		const updatedUser = await this.drizzleService.db
			.update(users)
			.set(userData)
			.where(eq(users.id, id))
			.returning();

		if (!updatedUser[0]) {
			return 'Failed to update user';
		}

		return updatedUser[0];
	}

	// Deactivate user by setting isActive to false
	async deactivateUser(id: number) {
		// Check if the user with the given id exists
		const userExists = await this.userIdExists(id);

		// Deactivate the user
		const deactivatedUser = await this.drizzleService.db
			.update(users)
			.set({ isActive: false })
			.where(eq(users.id, id))
			.returning();

		if (!deactivatedUser[0]) {
			return 'Failed to deactivate user';
		}

		return deactivatedUser[0];
	}

	// Add contact information to user
	async addUserContactInfo(id: number, contactInfoDto: CreateContactInfoDto) {
		const existingUser = await this.drizzleService.db
			.select()
			.from(users)
			.where(eq(users.id, id));

		if (!existingUser[0]) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const contactInfoId = existingUser[0].contactInfoId;

		// Update contact info from userContactInfo table
		const updatedUser = await this.drizzleService.db
			.update(userContactInfo)
			.set(contactInfoDto)
			.where(eq(contactInfoId, userContactInfo.id))
			.returning();

		if (!updatedUser[0]) {
			return 'Failed to update user contact info';
		}

		return updatedUser[0];
	}

	// Add FCM token to user
	async addFcmToken(id: number, fcmTokenData: AddFcmTokenDto) {
		const existingUser = await this.drizzleService.db
			.select()
			.from(users)
			.where(eq(users.id, id));

		if (!existingUser[0]) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const updatedUser = await this.drizzleService.db
			.update(users)
			.set({
				fcmTokens: [...existingUser[0].fcmTokens, fcmTokenData.token],
			})
			.where(eq(users.id, id))
			.limit(1)
			.returning();

		if (!updatedUser[0]) {
			return 'Failed to add user FCM token';
		}

		return updatedUser[0];
	}
}
