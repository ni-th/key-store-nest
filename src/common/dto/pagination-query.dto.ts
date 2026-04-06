import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export type SortOrder = 'ASC' | 'DESC';

export class PaginationQueryDto {
  @ApiProperty({
    required: false,
    default: 1,
    description: 'Page number (1-indexed)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({
    required: false,
    description: 'Sort field and order (e.g., "createdAt:desc")',
  })
  @IsOptional()
  sort?: SortOrder;

  @ApiProperty({
    required: false,
    description: 'Search query',
  })
  @IsOptional()
  search?: string;
}