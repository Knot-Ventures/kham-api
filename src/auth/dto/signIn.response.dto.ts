import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
	@ApiProperty()
	kind: string;
	@ApiProperty()
	localId: string;
	@ApiProperty()
	email: string;
	@ApiProperty()
	displayName: string;
	@ApiProperty()
	idToken: string;
	@ApiProperty()
	registered: boolean;
	@ApiProperty()
	refreshToken: string;
	@ApiProperty()
	expiresIn: string;
}
