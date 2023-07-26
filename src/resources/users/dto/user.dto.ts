// create-user.dto.ts

import { CreateAdminAccessDto } from './create-admin-access.dto';
import { CreateContactInfoDto } from './create-contact-info.dto';
import { CreateUserDto } from './create-user.dto';

export class UserDto {
	userData: CreateUserDto;
	contactInfoData: CreateContactInfoDto;
	adminAccessData: CreateAdminAccessDto;
}
