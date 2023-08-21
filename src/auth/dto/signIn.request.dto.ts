import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
	@ApiProperty()
	email: string;
	@ApiProperty()
	password: string;
}
