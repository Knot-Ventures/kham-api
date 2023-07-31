/* eslint-disable prettier/prettier */
import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { DrizzleError, eq, sql } from 'drizzle-orm';
import { DrizzleService } from '../../drizzle/drizzle.service';
import adminAccess from '../../drizzle/schema/admin_access';
import userContactInfo from '../../drizzle/schema/user_contact_info';
import users from '../../drizzle/schema/users';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) {}

	// Create a new user with contactInfo and Admin Access
	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		try {
			const createdUser = await this.drizzleService.db.transaction(
				async (tx) => {
					const { contactInfoData, adminAccessData, ...userData } =
						createUserDto;
					if (contactInfoData) {
						const contactInfo = await tx
							.insert(userContactInfo)
							.values(contactInfoData)
							.returning();
						userData.contactInfoId = contactInfo[0].id;
					}
					if (adminAccessData) {
						const userAdminAccess = await tx
							.insert(adminAccess)
							.values(adminAccessData)
							.returning();
						userData.adminAccessId = userAdminAccess[0].id;
					}
					const user = await tx
						.insert(users)
						.values(userData)
						.returning();
					return user;
				},
			);
			return createdUser[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create users.',
				);
			}
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
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create users.',
				);
			}
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
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create users.',
				);
			}
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
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else if (error.code === '22P02') {
				// handle specific error code
				const errorMessage = `Invalid UUID format for User ID ${userId}`;
				throw new BadRequestException(errorMessage);
			} else if (error instanceof HttpException) {
				const httpStatus = error.getStatus();
				if (httpStatus === HttpStatus.NOT_FOUND) {
					throw new NotFoundException('User not found');
				}
				throw error;
			} else {
				// Handle other unknown errors
				const errorMessage =
					error?.message ||
					error?.response?.message ||
					'Failed to create users.';
				throw new InternalServerErrorException(errorMessage);
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
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create users.',
				);
			}
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
	async addUserContactInfo(id: string, contactInfoDto: CreateContactInfoDto) {
		const existingUser = await this.userIdExists(id);
		const userContactInfoId = existingUser.contactInfoId;
		try {
			// Update contact info *from userContactInfo table
			const updatedUser = await this.drizzleService.db
				.update(userContactInfo)
				.set(contactInfoDto)
				.where(eq(userContactInfo.id, userContactInfoId))
				.returning();

			if (!updatedUser[0]) {
				return 'Failed to update user contact info';
			}

			return updatedUser[0];
		} catch (error) {
			if (error instanceof DrizzleError) {
				console.error(error.message);
			} else {
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create users.',
				);
			}
		}
	}

	// Add FCM token
	async addFcmToken(id: string, fcmTokenData: AddFcmTokenDto) {
		const existingUser = await this.userIdExists(id);
		try {
			const updatedUser = await this.drizzleService.db
				.update(users)
				.set({
					fcmTokens: [...existingUser.fcmTokens, fcmTokenData.token],
				})
				// .set({
				// 	fcmTokens: sql`ARRAY_APPEND(${existingUser.fcmTokens}, '${fcmTokenData.token}')`,
				// }) function array_append(record, unknown) does not exist
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
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to add fcm token.',
				);
			}
		}
	}

	async deactivateUser(id: string) {
		// Check if the user with the given id exists
		const userExists = await this.userIdExists(id);
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
				throw new InternalServerErrorException(
					error?.message ||
						error?.response?.message ||
						'Failed to create users.',
				);
			}
		}
	}
}
