import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  color_main_image: string;

  @IsString()
  color_detail_image: string;

  @IsString()
  @ApiProperty({ example: '헤라 립' })
  name: string;

  @IsInt()
  @ApiProperty({ example: 30000 })
  price: number;

  @IsString()
  @ApiProperty({ example: '헤라' })
  brand_name: string;

  @IsString()
  @ApiProperty({ example: '립' })
  category_name: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['베스트 상품', '립 베스트'] })
  hash_tag: string[];
}
