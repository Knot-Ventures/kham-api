import { UserEntity, UserType } from '../entities/user.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class FindAllUsersResponseDto {
	@ApiResponseProperty()
	limit: number;

	@ApiResponseProperty()
	page: number;

	@ApiResponseProperty({ type: () => UserEntity })
	data: UserEntity[];
}
