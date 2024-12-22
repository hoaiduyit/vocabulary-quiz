import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { randomString } from 'src/utils/helpers';
import { HttpStatusCode } from 'axios';
import { UserService } from '../users/user.service';
import { RoomGateway } from './gateway/room.gateway';
import { CommonStatus } from 'src/utils/constants';
import { ParticipantDTO } from './dto/participant.dto';
import { ScoreboardService } from '../scoreBoards/scoreboard.service';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private RoomRepository: Repository<Room>,
        private readonly userService: UserService,
        private readonly roomGateway: RoomGateway,
        @Inject(forwardRef(() => ScoreboardService)) private scoreboardService: ScoreboardService
    ) {}

    private async getRoomByCode(code: string): Promise<Room | null> {
        const room = await this.RoomRepository.createQueryBuilder('room')
            .leftJoinAndSelect('room.participants', 'participants')
            .leftJoinAndSelect('room.scoreboards', 'scoreboards')
            .leftJoinAndSelect('scoreboards.user', 'user')
            .select([
                'room.id',
                'room.code',
                'room.hostId',
                'room.status',
                'room.createdAt',
                'room.updatedAt',
                'participants.id',
                'participants.displayName',
                'scoreboards.score',
                'user.id',
                'user.displayName'
            ])
            .where('room.code = :code', { code })
            .andWhere('room.status = :status', { status: CommonStatus.ACTIVE })
            .orderBy('scoreboards.score', 'DESC')
            .getOne();
        return room;
    }

    async getRoomParticipants(code: string): Promise<ParticipantDTO[]> {
        const room = await this.getRoomByCode(code);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        return room.participants;
    }

    async findOneByCode(code: string): Promise<Room | null> {
        const room = await this.getRoomByCode(code);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        return room;
    }

    async create(body: CreateRoomDto): Promise<{ code: string }> {
        const randomCode = randomString(7);
        const host = await this.userService.findOne(body.hostId);
        if (!host) {
            throw new NotFoundException('Host not found');
        }
        const newRoom = this.RoomRepository.create({ ...body, code: randomCode });
        const savedRoom = await this.RoomRepository.save(newRoom);

        return {
            code: savedRoom.code
        };
    }

    async joinRoom(code: string, userId: string): Promise<number> {
        const room = await this.RoomRepository.findOne({
            where: { code },
            relations: ['participants']
        });
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        if (room.hostId === userId) {
            if (room.status === CommonStatus.DEACTIVE) {
                room.status = CommonStatus.ACTIVE;
                await this.RoomRepository.save(room);
            }
            this.roomGateway.hostJoinedRoom(code, room);

            return HttpStatusCode.Ok;
        }
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const isParticipant = room.participants.some((participant) => participant.id === userId);
        if (isParticipant) {
            throw new BadRequestException('User is already in the room');
        }

        room.participants.push(user);
        await this.RoomRepository.save(room);
        const userScoreboard = await this.scoreboardService.getUserScoreboardByRoomCode(code, userId);
        if (!userScoreboard) {
            await this.scoreboardService.create(userId, code);
        }
        this.roomGateway.userJoinedRoom(code, { userId: user.id, displayName: user.displayName }, room);

        return HttpStatusCode.Ok;
    }

    async leaveRoom(code: string, userId: string): Promise<number> {
        const room = await this.RoomRepository.findOne({
            where: { code },
            relations: ['participants']
        });
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        if (room.hostId === userId) {
            room.status = CommonStatus.DEACTIVE;
            await this.RoomRepository.save(room);
            this.roomGateway.hostLeftRoom(code, room);

            return HttpStatusCode.Ok;
        }
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const participantIndex = room.participants.findIndex((participant) => participant.id === userId);
        if (participantIndex === -1) {
            throw new BadRequestException('User is not in the room');
        }
        room.participants.splice(participantIndex, 1);

        await this.RoomRepository.save(room);
        this.roomGateway.userLeftRoom(code, { userId: user.id, displayName: user.displayName }, room);

        return HttpStatusCode.Ok;
    }
}
