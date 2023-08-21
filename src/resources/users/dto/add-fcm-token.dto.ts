import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFcmTokenDto {
	@IsString()
	@ApiProperty({
		example:
			'c2aK9KHmw8E:APA91bF7MY9bNnvGAXgbHN58lyDxc9KnuXNXwsqUs4uV4GyeF06HM1hMm-etu63S_4C-GnEtHAxJPJJC4H__VcIk90A69qQz65toFejxyncceg0_j5xwoFWvPQ5pzKo69rUnuCl1GSSv',
	})
	token: string;
}
