import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomDTO } from '../dto/query-room.dto';
import { QueryScoreboardDto } from '../dto/query-scoreboard.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomGateway {
    private server: Server;

    afterInit(server: Server) {
        this.server = server;
    }

    userJoinedRoom(code: string, user: { displayName: string; userId: string }, room: RoomDTO) {
        this.server.to(code).emit('userJoined', {
            userId: user.userId,
            message: `${user.displayName} joined the room`,
            room,
            paricipants: room.participants
        });
    }

    userLeftRoom(code: string, user: { displayName: string; userId: string }, room: RoomDTO) {
        this.server.to(code).emit('userLeft', {
            userId: user.userId,
            message: `${user.displayName} left the room`,
            room,
            paricipants: room.participants
        });
    }

    userScoreUpdated(code: string, userId: string, scoreboards: QueryScoreboardDto) {
        this.server.to(code).emit('scoreUpdated', {
            userId,
            message: `User score updated`,
            scoreboards
        });
    }

    hostJoinedRoom(code: string, room: RoomDTO) {
        this.server.to(code).emit('hostJoined', {
            message: `Host joined the room`,
            room
        });
    }

    hostLeftRoom(code: string, room: RoomDTO) {
        this.server.to(code).emit('hostLeft', {
            message: `Host left the room`,
            room
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data: { code: string }, @ConnectedSocket() client: Socket) {
        const { code } = data;
        client.join(code);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() data: { code: string }, @ConnectedSocket() client: Socket) {
        const { code } = data;
        client.leave(code);
    }

    @SubscribeMessage('updateScore')
    handlUpdateUserScore(@MessageBody() data: { code: string }, @ConnectedSocket() client: Socket) {
        const { code } = data;
        client.join(code);
    }
}
