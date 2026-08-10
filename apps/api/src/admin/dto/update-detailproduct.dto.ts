import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateDetailProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '차차틴트' })
  color_name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'https://example.com/chacha.jpg',
  })
  color_image?: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ example: 50 })
  stock?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  h?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ example: 99 })
  s?: number;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ example: 61 })
  l?: number;
}
