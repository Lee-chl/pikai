import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  color_main_image?: string;

  @IsString()
  @IsOptional()
  color_detail_image?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '헤라 립' })
  name?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 30000 })
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '헤라' })
  brand_name?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ example: ['베스트 상품', '립 베스트'] })
  hash_tag?: string[];
}
