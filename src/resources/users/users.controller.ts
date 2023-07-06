import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Headers,
	MethodNotAllowedException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	Res,
	StreamableFile,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import { User } from './entities/user.entity';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * Authorize User
	 * Create Account
	 */
	@Post()
	@ApiCreatedResponse({ type: User })
	create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.usersService.create(createUserDto) as any;
	}

	/**
	 * Authorize Kham/Sales/CSR
	 *
	 * paginate
	 */
	@Get()
	@ApiOkResponse({ type: User, isArray: true })
	findAll(@Req() request: Request & { user: any }): Promise<User[]> {
		// console.log({ user: request.user });
		return this.usersService.findAll() as any;
	}

	/**
	 *
	 * Authorize User and get their data from the authorization response
	 */
	@Get('me')
	@ApiOkResponse({ type: User })
	getMe(@Req() request: Request) {}

	/**
	 * Authorize Kham/Sales/CSR or the user with same id
	 */
	@Get(':id')
	@ApiOkResponse({ type: User })
	findOne(@Param('id') id: string) {}

	/**
	 * Authorize the user with same id
	 * and edit their profile
	 */
	@Patch(':uid')
	@ApiResponse({ type: User })
	update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {}

	/**
	 *
	 * deactivate account only
	 */
	@Delete(':uid')
	delete(@Param('uid') uid: string) {
		return this.usersService.remove(uid);
	}

	/**
	 * add and FirebaseMessaging token to their profile
	 */
	@Patch(':uid/contact-info')
	changeContactUserInfo(@Param('uid') uid: string) {}
	//#region Notifications

	/**
	 * add and FirebaseMessaging token to their profile
	 */
	@ApiBody({ type: AddFcmTokenDto })
	@Post(':uid/fcm-token')
	addFcmToken(@Param('uid') uid: string, @Body('token') token: string) {
		return this.usersService.addFcmToken(uid, token);
	}

	//#endregion
}
