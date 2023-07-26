import { ApiProperty } from '@nestjs/swagger';
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export enum UserType {
	Individual = 'individual',
	Business = 'business',
}

export enum BusinessType {
	Factory = 'factory',
	Supplier = 'supplier',
	Restaurant = 'restaurant',
}

export class CreateUserDto {
	@IsString()
	@ApiProperty()
	firstName: string;

	@IsString()
	@ApiProperty()
	lastName: string;

	@IsString()
	@IsOptional()
	@ApiProperty({ required: false })
	profileImage?: string;

	@IsEnum(UserType)
	@ApiProperty({ enum: UserType, required: true })
	userType: UserType;

	@IsEnum(BusinessType)
	@IsOptional()
	@ApiProperty({ enum: BusinessType, required: false })
	businessType?: BusinessType;

	@IsArray()
	@ArrayMaxSize(256)
	@IsOptional()
	@ApiProperty({ type: [String], required: false })
	fcmTokens?: string[];

	@IsNumber()
	@IsOptional()
	@ApiProperty({ type: Number, required: false })
	authId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ type: Number, required: false })
	contactInfoId?: number;

	@IsNumber()
	@IsOptional()
	@ApiProperty({ type: Number, required: false })
	adminAccessId?: number;

	// @IsBoolean()
	// @IsOptional()
	// @ApiProperty({ type: Boolean, required: false })
	// isActive?: boolean;

	name: string;
}
