/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import userContactInfo from 'src/drizzle/schema/user_contact_info';
import users from 'src/drizzle/schema/users';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserContactInfoDto } from './dto/userContactInfo.dto';

const DEFAULT_CATEGORY_ID = 'default';
const DEFAULT_LABEL_ID = 'default';
@Injectable()
export class UsersService {
	constructor(private readonly drizzleService: DrizzleService) {}

	//createUser
	async createUser(userData: CreateUserDto) {
		const createdUser = await this.drizzleService.db
			.insert(users)
			.values(userData)
			.returning();
		return createdUser;
	}

	//findAll
	async findAll(page: number, limit: number) {
		//get total of Pages
		const totalUsers = await this.drizzleService.db.select().from(users);
		const totalCount = totalUsers.length;
		const totalPages = Math.ceil(totalCount / limit);
		//pagination query
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

	//findOne
	async findOne(id: number) {
		const result = await this.drizzleService.db
			.select()
			.from(users)
			.where(eq(users.id, id));

		if (!result[0]) {
			throw new Error(`User with ID ${id} not found`);
		}
		return result[0];
	}

	//updateUser
	async updateUser(id: number, userData: UpdateUserDto) {
		const userExists = await this.findOne(id);

		if (!userExists) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const updatedUser = await this.drizzleService.db
			.update(users)
			.set(userData)
			.where(eq(users.id, id))
			.returning();

		if (!updatedUser[0]) {
			throw new Error('Failed to update user');
		}

		return updatedUser[0];
	}

	//deleteUser
	async deleteUser(id: number) {
		const deletedUser = await this.drizzleService.db
			.delete(users)
			.where(eq(users.id, id))
			.returning();

		if (!deletedUser[0]) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}
		return deletedUser[0];
	}

	//addUserContactInfo
	async addUserContactInfo(id: number, contactInfoDto: UserContactInfoDto) {
		const existingUser = await this.drizzleService.db
			.select()
			.from(users)
			.where(eq(users.id, id));

		if (!existingUser[0]) {
			throw new NotFoundException(`User with ID ${id} not found`);
		}

		const contactInfoId = existingUser[0].contactInfoId;

		// update contact info *from userContactInfo table
		const updatedUser = await this.drizzleService.db
			.update(userContactInfo)
			.set(contactInfoDto)
			.where(eq(users.contactInfoId, contactInfoId))
			.returning();

		if (!updatedUser[0]) {
			throw new Error('Failed to update user contact info');
		}

		return updatedUser[0];
	}

	//addFcmToken
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
			.returning();

		if (!updatedUser[0]) {
			throw new Error('Failed to update user with FCM token');
		}

		return updatedUser[0];
	}
}
