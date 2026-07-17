import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryRatingDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ description: '사용자 ID', required: true, example: 1 })
  userId: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ description: '페이지 넘버', required: false, example: 1 })
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({ description: '가져올 수', required: false, example: 10 })
  limit: number = 10;
}
