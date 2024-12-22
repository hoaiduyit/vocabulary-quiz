import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoomModule } from './modules/rooms/room.module';
import { ScoreboardModule } from './modules/scoreBoards/scoreboard.module';

@Module({
    imports: [ConfigModule, DatabaseModule, UserModule, RoomModule, AuthModule, ScoreboardModule],
    controllers: [AppController],
    providers: [AppService, JwtStrategy]
})
export class AppModule {}
