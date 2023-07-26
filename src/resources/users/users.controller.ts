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
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import { Auth } from '../../auth/decorators/auth.decorator';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: 'Create a new user' })
	@ApiCreatedResponse({
		description: 'The user has been successfully created.',
	})
	@Post()
	async createUser(@Body() Data: UserDto): Promise<User> {
		return this.usersService.createUser(Data);
	}

	//add user without contact info and admin access
	@Post('me')
	async createOne(@Body() userData: CreateUserDto): Promise<User> {
		return this.usersService.createOne(userData);
	}

	/**
	 * Get all users
	 */
	@ApiOperation({ summary: 'Get all users' })
	@ApiOkResponse({ type: UserDto, isArray: true })
	@ApiQuery({ name: 'page', required: false, type: Number })
	@ApiQuery({ name: 'limit', required: false, type: Number })
	@Get()
	async findAll(
		@Query('page') page = 1,
		@Query('limit') limit = 10,
	): Promise<User[]> {
		return this.usersService.findAll(page, limit);
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
	 *
	 * Authorize User and get their data from the authorization response
	 */
	@Get('me')
	@ApiOkResponse({ type: User })
	getMe(@Req() request: Request) {
		return 'not-implemented';
	}

	/**
	 * Authorize the user with same id
	 * and edit their profile
	 */
	@Patch(':uid')
	@ApiResponse({ type: User })
	update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
		return 'not-implemented';
	}

	/**
	 *
	 * deactivate account only
	 */
	@Delete(':uid')
	delete(@Param('uid') uid: string) {
		return 'not-implemented';
	}

	/**
	 * add and FirebaseMessaging token to their profile
	 */
	@Patch(':uid/contact-info')
	changeContactUserInfo(@Param('uid') uid: string) {
		return 'not-implemented';
	}
	//#region Notifications

	/**
	 * add and FirebaseMessaging token to their profile
	 */
	@ApiBody({ type: AddFcmTokenDto })
	@Post(':uid/fcm-token')
	addFcmToken(@Param('uid') uid: string, @Body('token') token: string) {
		return 'not-implemented';
	}

	//#endregion
}
