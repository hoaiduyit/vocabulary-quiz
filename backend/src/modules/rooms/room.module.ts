import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UserModule } from '../users/user.module';
import { RoomGateway } from './gateway/room.gateway';
import { Scoreboard } from './entities/scoreboard.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Room, Scoreboard]), forwardRef(() => AuthModule), forwardRef(() => UserModule)],
    providers: [RoomService, JwtService, RoomGateway],
    controllers: [RoomController],
    exports: [TypeOrmModule, RoomService]
})
export class RoomModule {}
