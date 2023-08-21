import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import { Auth } from '../../auth/decorators/auth.decorator';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { FindAllUsersResponseDto } from './dto/find-all-users-response.dto';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * Authorize User
	 * Create Account
	 */
	@ApiOperation({ summary: 'Create a new user' })
	@ApiCreatedResponse({
		description: 'The user has been successfully created.',
	})
	@Post()
	async createUser(
		@Body() dto: CreateUserDto,
		@Req() request: Request,
	): Promise<UserEntity> {
		if (dto.authId !== request.user.firebaseUser.uid)
			throw new ForbiddenException();
		return this.usersService.createUser(dto);
	}

	/**
	 * Authorize Kham/Sales/CSR
	 *
	 * paginate
	 */
	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({ type: FindAllUsersResponseDto })
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@Get()
	async findAll(
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<FindAllUsersResponseDto> {
		return {
			limit,
			page,
			data: await this.usersService.findAll(page, limit),
		};
	}

	/**
	 *
	 * Authorize User and get their data from the authorization response
	 */
	@ApiOperation({ summary: 'Get the current user' })
	@ApiOkResponse({ type: UserEntity })
	@Get('me')
	async getMe(@Req() request: Request) {
		return request.user?.data;
	}

	/**
	 * Authorize Kham/Sales/CSR or the user with same id
	 */
	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiOkResponse({ type: UserEntity })
	@Get(':id')
	async getUserById(@Param('id') id: string): Promise<UserEntity> {
		return this.usersService.findOne(id);
	}

	/**
	 * Update a user
	 */
	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({ type: UserEntity })
	@Patch(':id')
	async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
		return this.usersService.updateUser(id, userData);
	}

	/**
	 * Update user's contact information
	 */
	@ApiOperation({ summary: 'Update user contact information' })
	@ApiBody({ type: CreateContactInfoDto })
	@Patch(':id/contact-info/:contactInfoId')
	async updateContactInfo(
		@Param('id') id: string,
		@Param('contactInfoId') contactInfoId: string,
		@Body() contactInfoDto: CreateContactInfoDto,
	) {
		return await this.usersService.updateUserContactInfo(
			id,
			contactInfoId,
			contactInfoDto,
		);
	}

	/**
	 * Add a Firebase Messaging token to user's profile
	 */
	@ApiOperation({ summary: 'Add a Firebase Messaging token to user profile' })
	@ApiBody({ type: AddFcmTokenDto })
	@Post(':id/fcm-tokens')
	async addFcmToken(
		@Param('id') id: string,
		@Body() fcmTokenData: AddFcmTokenDto,
	) {
		return this.usersService.addFcmToken(id, fcmTokenData);
	}

	/**
	 *
	 * deactivate account only
	 */
	@ApiOperation({ summary: 'Deactivate a user' })
	@Delete(':uid')
	async deactivateUser(@Param('uid') uid: string) {
		return this.usersService.deactivateUser(uid);
	}
}
