import { PaginationDto } from './pagination.dto';

export class QueryPaginDto extends PaginationDto {
    total: number;
    totalPages: number;
}
