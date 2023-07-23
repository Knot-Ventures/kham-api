import {
	Body,
	Controller,
	Delete,
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
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

import { Auth } from '../../auth/decorators/auth.decorator';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateAdminAccessDto } from './dto/createAdminAccess.dto';
import { CreateContactInfoDto } from './dto/createContactInfo.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * Create a new user
	 */
	@ApiOperation({ summary: 'Create a new user' })
	@ApiCreatedResponse({ type: UserDto })
	@Post()
	async createUser(
		@Body() userData: CreateUserDto,
		@Body() contactInfoData: CreateContactInfoDto,
		@Body() adminAccessData: CreateAdminAccessDto,
	) {
		return this.usersService.createUser(
			userData,
			contactInfoData,
			adminAccessData,
		);
	}

	/**
	 * Get all users
	 */
	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({ type: UserDto, isArray: true })
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@Get()
	async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
		return this.usersService.findAll(page, limit);
	}

	/**
	 * Get the current user
	 */
	@ApiOperation({ summary: 'Get the current user' })
	@ApiOkResponse({ type: UserDto })
	@Get('me')
	async getMe(@Req() request: Request) {
		//const userId = request.user.id; // assuming the user id is available in the request
		// return this.usersService.findOne(userId);
	}

	/**
	 * Get a user by ID
	 */
	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiOkResponse({ type: UserDto })
	@Get(':id')
	async getUserById(@Param('id') id: number) {
		return this.usersService.findOne(id);
	}

	/**
	 * Update a user
	 */
	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({ type: UserDto })
	@Patch(':id')
	async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto) {
		return this.usersService.updateUser(id, userData);
	}

	/**
	 * Deactivate a user
	 */
	@ApiOperation({ summary: 'Deactivate a user' })
	@Delete(':id')
	async deactivateUser(@Param('id') id: number) {
		return this.usersService.deactivateUser(id);
	}

	/**
	 * Update user's contact information
	 */
	@ApiOperation({ summary: 'Update user contact information' })
	@ApiBody({ type: CreateContactInfoDto })
	@Patch(':id/contact-info')
	async updateContactInfo(
		@Param('id') id: number,
		@Body() contactInfoDto: CreateContactInfoDto,
	) {
		return await this.usersService.addUserContactInfo(id, contactInfoDto);
	}

	/**
	 * Add a Firebase Messaging token to user's profile
	 */
	@ApiOperation({ summary: 'Add a Firebase Messaging token to user profile' })
	@ApiBody({ type: AddFcmTokenDto })
	@Post(':id/fcm-tokens')
	async addFcmToken(
		@Param('id') id: number,
		@Body() fcmTokenData: AddFcmTokenDto,
	) {
		return this.usersService.addFcmToken(id, fcmTokenData);
	}
}
