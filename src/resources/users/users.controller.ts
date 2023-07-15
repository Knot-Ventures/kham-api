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
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

import { Auth } from '../../auth/decorators/auth.decorator';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserContactInfoDto } from './dto/userContactInfo.dto';

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * Authorize User
	 * Create Account
		@Post()
		@ApiCreatedResponse({ type: User })
		create(@Body() createUserDto: CreateUserDto) {
			return 'not-implemented';
		}
	 */
	@ApiOperation({ summary: 'Create a new user' })
	@ApiCreatedResponse({ type: UserDto }) //Not Accept Users Schema
	@Post()
	async createUser(@Body() userData: CreateUserDto) {
		return this.usersService.createUser(userData);
	}

	/**
	 * Authorize Kham/Sales/CSR
	 *
	 * paginate
		@Get()
		@ApiOkResponse({ type: User, isArray: true })
		findAll(@Req() request: Request & { user: any }) {
			return 'not-implemented';
		}
	 */
	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({ type: UserDto, isArray: true })
	@Get()
	async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
		return this.usersService.findAll(page, limit);
	}

	/**
	 *
	 * Authorize User and get their data from the authorization response
	@Get('me')
	@ApiOkResponse({ type: User })
	getMe(@Req() request: Request) {
		return 'not-implemented';
	}
	 */
	@ApiOperation({ summary: 'Get the current user' })
	@ApiOkResponse({ type: UserDto })
	@Get('me')
	async getMe(@Req() request: Request) {
		//const userId = request.user.id; // assuming the user id is available in the request
		//return this.usersService.findOne(userId);
	}

	/**
	 * Authorize Kham/Sales/CSR or the user with same id
	@Get(':uid')
	@ApiOkResponse({ type: User })
	findOne(@Param('uid') uid: string) {
		return 'not-implemented';
	}
	 */
	@ApiOperation({ summary: 'Get a user by ID' })
	@ApiOkResponse({ type: UserDto })
	@Get(':id')
	async getUserById(@Param('id') id: number) {
		return this.usersService.findOne(id);
	}

	/**
	 * Authorize the user with same id
	 * and edit their profile
		@Patch(':uid')
		@ApiResponse({ type: User })
		update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
			return 'not-implemented';
		}
	 */
	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({ type: UserDto })
	@Patch(':id')
	async updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto) {
		return this.usersService.updateUser(id, userData);
	}

	/**
	 *
	 * deactivate account only
		@Delete(':uid')
		delete(@Param('uid') uid: string) {
			return 'not-implemented';
		}
	 */
	@ApiOperation({ summary: 'Delete a user' })
	@Delete(':id')
	async deleteUser(@Param('id') id: number) {
		return this.usersService.deleteUser(id);
	}

	/**
	 * add and FirebaseMessaging token to their profile
		@Patch(':uid/contact-info')
		changeContactUserInfo(@Param('uid') uid: string) {
			return 'not-implemented';
		}
	 */
	@Patch(':id/contact-info')
	async updateContactInfo(
		@Param('id') id: number,
		@Body() contactInfoDto: UserContactInfoDto,
	) {
		return await this.usersService.addUserContactInfo(id, contactInfoDto);
	}
	//#region Notifications

	/**
	 * add and FirebaseMessaging token to their profile
		@ApiBody({ type: AddFcmTokenDto })
		@Post(':uid/fcm-token')
		addFcmToken(@Param('uid') uid: string, @Body('token') token: string) {
			return 'not-implemented';
		}
	 */
	@Post(':id/fcm-tokens')
	async addFcmToken(
		@Param('id') id: number,
		@Body() fcmTokenData: AddFcmTokenDto,
	) {
		return this.usersService.addFcmToken(id, fcmTokenData);
	}
	//#endregion
}
