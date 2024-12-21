import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @Post('guest')
    async createGuestAccount(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);
        return await this.authService.login({ userId: user.id, displayName: user.displayName });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@CurrentUser() user: { userId: string }) {
        const profile = await this.userService.findLoggedInUserProfile(user.userId);
        return profile;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.userService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async updateAccount(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
        return await this.userService.update(id, updateUser);
    }
}
