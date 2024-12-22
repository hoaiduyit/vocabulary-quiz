import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Scoreboard } from './entities/scoreboard.entity';
import { UserService } from '../users/user.service';
import { RoomService } from '../rooms/room.service';
import { Repository } from 'typeorm';
import { HttpStatusCode } from 'axios';

@Injectable()
export class ScoreboardService {
    constructor(
        @InjectRepository(Scoreboard) private ScoreboardRepository: Repository<Scoreboard>,
        private readonly userService: UserService,
        @Inject(forwardRef(() => RoomService)) private roomService: RoomService
    ) {}

    private async checkIfUserInTheRoom(code: string, userId: string): Promise<boolean> {
        const participantsId = (await this.roomService.getRoomParticipants(code)).map((item) => item.id);
        return participantsId.includes(userId);
    }

    private async findByRoomCodeAndUserId(roomCode: string, userId: string): Promise<Partial<Scoreboard> | null> {
        const scoreboard = await this.ScoreboardRepository.createQueryBuilder('scoreboard')
            .select([
                'scoreboard.id',
                'scoreboard.score',
                'scoreboard.createdAt',
                'scoreboard.updatedAt',
                'user.id',
                'user.displayName',
                'room.id',
                'room.code'
            ])
            .leftJoin('scoreboard.user', 'user')
            .leftJoin('scoreboard.room', 'room')
            .where('room.code = :roomCode', { roomCode })
            .andWhere('user.id = :userId', { userId })
            .getOne();

        return scoreboard;
    }

    async getUserScoreboardByRoomCode(code: string, userId: string): Promise<Partial<Scoreboard> | null> {
        return await this.findByRoomCodeAndUserId(code, userId);
    }

    async create(userId: string, roomCode: string): Promise<string> {
        const user = await this.userService.findOne(userId);
        const room = await this.roomService.findOneByCode(roomCode);
        const isUserInTheRoom = await this.checkIfUserInTheRoom(roomCode, userId);
        if (!isUserInTheRoom) {
            throw new BadRequestException('User is not in the room');
        }
        const userScoreboard = this.ScoreboardRepository.create({ room, user });
        const scoreboard = await this.ScoreboardRepository.save(userScoreboard);
        return scoreboard.id;
    }

    async updateByRoomCodeAndUserId(roomCode: string, userId: string, score: number): Promise<number> {
        const isUserInTheRoom = await this.checkIfUserInTheRoom(roomCode, userId);
        if (!isUserInTheRoom) {
            throw new BadRequestException('User is not in the room');
        }
        const scoreboard = await this.findByRoomCodeAndUserId(roomCode, userId);
        if (!scoreboard) {
            throw new NotFoundException('Scoreboard not found');
        }
        scoreboard.score = score;
        await this.ScoreboardRepository.save(scoreboard);
        return HttpStatusCode.Ok;
    }
}
