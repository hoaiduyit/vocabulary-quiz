import { ParticipantDTO } from './participant.dto';

export class RoomDTO {
    id: string;
    code: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    participants: ParticipantDTO[];
}
