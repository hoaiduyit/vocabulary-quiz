import { ParticipantDTO } from './participant.dto';
import { ScoreboardDTO } from './scoreboard.dto';

export class RoomDTO {
    id: string;
    code: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    participants: ParticipantDTO[];
    scoreboards: ScoreboardDTO[];
}
