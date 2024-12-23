import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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

    @Get('scoreboards/:code')
    async getScoreboards(
        @Param('code') code: string,
        @Query('page') page: number = 1,
        @Query('page') limit: number = 20
    ) {
        return await this.roomService.findAllScoreboardsByRoomCode(code, { page, limit });
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

    @UseGuards(AuthGuard('jwt'))
    @Put('scoreboards/update/:code')
    async updateUserScore(
        @Param('code') code: string,
        @CurrentUser() user: { userId: string },
        @Body() body: { score: number }
    ) {
        return await this.roomService.updateByRoomCodeAndUserId(code, user.userId, body.score);
    }
}
