import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@CurrentUser() user: { userId: string }) {
        return await this.roomService.create({ hostId: user.userId });
    }

    @Get(':code')
    async getRoom(@Param('code') code: string) {
        return await this.roomService.findOneByCode(code);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('join/:code')
    async joinRoom(@Param('code') code: string, @CurrentUser() user: { userId: string }) {
        return await this.roomService.joinRoom(code, user.userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('leave/:code')
    async leaveRoom(@Param('code') code: string, @CurrentUser() user: { userId: string }) {
        return await this.roomService.leaveRoom(code, user.userId);
    }
}
