import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseService } from '../firebase/firebase.service';
import { SignInRequestDto } from './dto/signIn.request.dto';
import { SignInResponseDto } from './dto/signIn.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly firebaseService: FirebaseService) {}

	@ApiOperation({ summary: 'Sign In' })
	@ApiCreatedResponse({ type: SignInResponseDto })
	@Post()
	async signIn(@Body() dto: SignInRequestDto) {
		return this.firebaseService.signIn(dto);
	}
}
