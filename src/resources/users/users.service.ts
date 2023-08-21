/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { DrizzleError, eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import userContactInfo from '../../drizzle/schema/user_contact_info';
import users from '../../drizzle/schema/users';
import { handleServiceError } from '../utilities/error-handling.util';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { PgInsertValue } from 'drizzle-orm/pg-core';

@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) {}

	// Create a new user with contactInfo and Admin Access
	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		try {
			return await this.drizzleService.db.transaction(async (tx) => {
				const { contactInfoData, ...userData } = createUserDto;
				const insertedData: PgInsertValue<typeof users> = {
					...userData,
				};

				const user = await tx
					.insert(users)
					.values(insertedData)
					.returning();

				if (contactInfoData) {
					await tx
						.insert(userContactInfo)
						.values({
							...contactInfoData,
							userId: user[0].id,
							default: true,
						})
						.returning();
				}
				return user[0];
			});
		} catch (error) {
			handleServiceError(error, 'Failed to create user');
		}
	}

	// Create a user without contact info and admin access
	async createOne(userData: CreateUserDto): Promise<UserEntity> {
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
			handleServiceError(error, 'Failed to create user');
		}
	}

	// Find all users with pagination
	async findAll(page: number, limit: number): Promise<UserEntity[]> {
		const offset = (page - 1) * limit;

		try {
			return this.drizzleService.db
				.select()
				.from(users)
				.limit(limit)
				.offset(offset);
		} catch (error) {
			handleServiceError(error, 'Failed to find users');
		}
	}

	// Find a user by ID (with his contact info and admin access)
	async findOne(userId: string): Promise<any> {
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
			if (error.code === '22P02') {
				// handle specific error code
				const errorMessage = `Invalid UUID format for User ID ${userId}`;
				throw new BadRequestException(errorMessage);
			} else {
				handleServiceError(error, 'Failed to find user');
			}
		}
	}
	// Find a user by ID (with his contact info and admin access)
	async findOneByAuthId(userId: string): Promise<UserEntity> {
		try {
			const user = await this.drizzleService.db.query.users
				.findFirst({
					where: eq(users.authId, userId),
					with: {
						contactInfo: true,
						adminAccess: true,
					},
				})
				.execute();

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
			if (error.code === '22P02') {
				// handle specific error code
				const errorMessage = `Invalid UUID format for User ID ${userId}`;
				throw new BadRequestException(errorMessage);
			} else {
				handleServiceError(error, 'Failed to find user');
			}
		}
	}

	// Update user data
	async updateUser(id: string, userData: UpdateUserDto) {
		const userExists = (
			await this.drizzleService.db
				.select({
					count: sql<number>`count(
                    ${users.id}
                    )`,
				})
				.from(users)
				.limit(1)
				.where(eq(users.id, id))
		)?.[0]?.count;
		if (userExists <= 0) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		try {
			// Update the user's data
			const updatedUser = await this.drizzleService.db
				.update(users)
				.set(userData)
				.where(eq(users.id, id))
				.returning();

			if (!updatedUser[0]) {
				throw new Error('Failed to update user');
			}

			return updatedUser[0];
		} catch (error) {
			handleServiceError(error, 'Failed to update catalog request');
		}
	}

	//check existing user
	async userIdExists(id: string): Promise<UserEntity> {
		const existingUser = await this.drizzleService.db
			.select()
			.from(users)
			.limit(1)
			.where(eq(users.id, id));

		if (!existingUser[0]) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		return existingUser[0];
	}

	// Add contact information to user
	async updateUserContactInfo(
		id: string,
		contactInfoId: string,
		contactInfoDto: CreateContactInfoDto,
	) {
		await this.userIdExists(id);

		try {
			// Update contact info *from userContactInfo table
			const updatedUser = await this.drizzleService.db
				.update(userContactInfo)
				.set(contactInfoDto)
				.where(eq(userContactInfo.id, contactInfoId))
				.returning();

			if (!updatedUser[0]) {
				return 'Failed to update user contact info';
			}

			return updatedUser[0];
		} catch (error) {
			handleServiceError(error, 'Failed to update user contact info');
		}
	}

	// Add FCM token
	async addFcmToken(id: string, fcmTokenData: AddFcmTokenDto) {
		await this.userIdExists(id);
		try {
			const updatedUser = await this.drizzleService.db
				.update(users)
				.set({
					fcmTokens: sql`ARRAY_APPEND(${users.fcmTokens}, ${fcmTokenData.token})`,
				})
				.where(eq(users.id, id))
				.returning();
			if (!updatedUser[0]) {
				return 'Failed to add user FCM token';
			}

			return updatedUser[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				handleServiceError(error, 'Failed to add user FCM token');
			}
		}
	}

	async deactivateUser(id: string) {
		// Check if the user with the given id exists
		await this.userIdExists(id);
		try {
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
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				handleServiceError(error, 'Failed to deactivate user');
			}
		}
	}
}
