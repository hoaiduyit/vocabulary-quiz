import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Scoreboard } from './entities/scoreboard.entity';
import { RoomModule } from '../rooms/room.module';
import { ScoreboardService } from './scoreboard.service';
import { ScoreboardController } from './scoreboard.controller';
import { UserModule } from '../users/user.module';
import { RoomGateway } from '../rooms/gateway/room.gateway';

@Module({
    imports: [TypeOrmModule.forFeature([Scoreboard]), forwardRef(() => UserModule), forwardRef(() => RoomModule)],
    providers: [ScoreboardService, JwtService, RoomGateway],
    controllers: [ScoreboardController],
    exports: [TypeOrmModule, ScoreboardService]
})
export class ScoreboardModule {}
