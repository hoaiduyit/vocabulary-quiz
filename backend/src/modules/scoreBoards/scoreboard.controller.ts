import { Controller, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ScoreboardService } from './scoreboard.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Scoreboard')
@Controller('scoreboards')
export class ScoreboardController {
    constructor(private readonly scoreboardService: ScoreboardService) {}

    @UseGuards(AuthGuard('jwt'))
    @Put('update/:code')
    async leaveRoom(
        @Param('code') code: string,
        @CurrentUser() user: { userId: string },
        @Body() body: { score: number }
    ) {
        return await this.scoreboardService.updateByRoomCodeAndUserId(code, user.userId, body.score);
    }
}
