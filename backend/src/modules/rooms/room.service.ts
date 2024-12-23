import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { Scoreboard } from './entities/scoreboard.entity';
import { PaginationDto } from 'src/common/dto';
import { QueryScoreboardDto } from './dto/query-scoreboard.dto';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room) private RoomRepository: Repository<Room>,
        @InjectRepository(Scoreboard) private ScoreboardRepository: Repository<Scoreboard>,
        private readonly userService: UserService,
        private readonly roomGateway: RoomGateway
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

    private async checkIfUserInTheRoom(code: string, userId: string): Promise<boolean> {
        const participantsId = (await this.getRoomParticipants(code)).map((item) => item.id);
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

    async findAllScoreboardsByRoomCode(
        code: string,
        pagination: PaginationDto = { page: 1, limit: 10 }
    ): Promise<QueryScoreboardDto> {
        const { limit, page } = pagination;
        const skip = (page - 1) * limit;

        const [scoreboards, total] = await this.ScoreboardRepository.createQueryBuilder('scoreboard')
            .select(['scoreboard.id', 'scoreboard.score', 'scoreboard.updatedAt', 'user.id', 'user.displayName'])
            .leftJoin('scoreboard.user', 'user')
            .leftJoin('scoreboard.room', 'room')
            .where('room.code = :code', { code })
            .orderBy('scoreboard.score', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            scoreboards,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findOneByCode(code: string): Promise<Room | null> {
        const room = await this.getRoomByCode(code);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        return room;
    }

    async getUserScoreboardByRoomCode(code: string, userId: string): Promise<Partial<Scoreboard> | null> {
        return await this.findByRoomCodeAndUserId(code, userId);
    }

    async createUserScorboardInRoom(userId: string, roomCode: string): Promise<string> {
        const user = await this.userService.findOne(userId);
        const room = await this.findOneByCode(roomCode);
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
        const scoreboards = await this.findAllScoreboardsByRoomCode(roomCode);
        this.roomGateway.userScoreUpdated(roomCode, userId, scoreboards);

        return HttpStatusCode.Ok;
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
        const room = await this.RoomRepository.createQueryBuilder('room')
            .leftJoinAndSelect('room.participants', 'participants')
            .select([
                'room.id',
                'room.code',
                'room.hostId',
                'room.status',
                'room.createdAt',
                'room.updatedAt',
                'participants.id',
                'participants.displayName'
            ])
            .where('room.code = :code', { code })
            .getOne();
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
        const userScoreboard = await this.getUserScoreboardByRoomCode(code, userId);
        if (!userScoreboard) {
            await this.createUserScorboardInRoom(userId, code);
        }
        const scoreboards = await this.findAllScoreboardsByRoomCode(code);
        this.roomGateway.userScoreUpdated(code, userId, scoreboards);
        this.roomGateway.userJoinedRoom(code, { userId: user.id, displayName: user.displayName }, room);

        return HttpStatusCode.Ok;
    }

    async leaveRoom(code: string, userId: string): Promise<number> {
        const room = await this.RoomRepository.createQueryBuilder('room')
            .leftJoinAndSelect('room.participants', 'participants')
            .select([
                'room.id',
                'room.code',
                'room.hostId',
                'room.status',
                'room.createdAt',
                'room.updatedAt',
                'participants.id',
                'participants.displayName'
            ])
            .where('room.code = :code', { code })
            .getOne();
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
