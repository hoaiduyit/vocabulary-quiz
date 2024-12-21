import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    username: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    email: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    password: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    confirmPassword: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty()
    displayName: string;
}
