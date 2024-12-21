import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @Type(() => Number)
    @Min(1)
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    page?: number;

    @Type(() => Number)
    @Min(1)
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false })
    limit?: number;
}
