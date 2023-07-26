import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Req,
} from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

import { Auth } from '../../auth/decorators/auth.decorator';
import { AddFcmTokenDto } from './dto/add-fcm-token.dto';
import { CreateAdminAccessDto } from './dto/createAdminAccess.dto';
import { CreateContactInfoDto } from './dto/createContactInfo.dto';
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
	async createUser(
		@Body() userData: CreateUserDto,
		@Body() contactInfoData: CreateContactInfoDto,
		@Body() adminAccessData: CreateAdminAccessDto,
	): Promise<User> {
		return this.usersService.createUser(
			userData,
			contactInfoData,
			adminAccessData,
		);
	}

	/**
	 * Authorize Kham/Sales/CSR
	 *
	 * paginate
	 */
	@Get()
	@ApiOkResponse({ type: User, isArray: true })
	findAll(@Req() request: Request & { user: any }) {
		return 'not-implemented';
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
	 * Authorize Kham/Sales/CSR or the user with same id
	 */
	@Get(':uid')
	@ApiOkResponse({ type: User })
	findOne(@Param('uid') uid: string) {
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
