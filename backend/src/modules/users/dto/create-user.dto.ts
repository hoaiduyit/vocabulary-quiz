import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole, CommonStatus } from 'src/utils/constants';

export class CreateUserDto {
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
    @ApiProperty()
    displayName: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    role: string = UserRole.GUEST;

    @IsString()
    @IsOptional()
    @ApiProperty()
    status: string = CommonStatus.ACTIVE;

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    deleted: boolean = false;
}
