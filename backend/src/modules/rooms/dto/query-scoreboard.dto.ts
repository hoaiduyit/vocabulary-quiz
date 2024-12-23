import { QueryPaginDto } from 'src/common/dto/query-pagin.dto';
import { Scoreboard } from '../entities/scoreboard.entity';

export class QueryScoreboardDto extends QueryPaginDto {
    scoreboards: Scoreboard[];
}
