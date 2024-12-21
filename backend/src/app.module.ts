import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './jwt-strategy/jwt-strategy';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoomModule } from './modules/rooms/room.module';

@Module({
    imports: [ConfigModule, DatabaseModule, UserModule, RoomModule, AuthModule],
    controllers: [AppController],
    providers: [AppService, JwtStrategy]
})
export class AppModule {}
