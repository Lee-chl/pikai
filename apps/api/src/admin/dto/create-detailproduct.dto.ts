import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateDetailProductDto {
  @IsString()
  @ApiProperty({ example: '차차틴트' })
  color_name: string;

  @IsString()
  color_image: string;

  @IsInt()
  @ApiProperty({ example: 30 })
  stock: number;

  @IsInt()
  @ApiProperty({ example: 10 })
  h: number;

  @IsInt()
  @ApiProperty({ example: 99 })
  s: number;

  @IsInt()
  @ApiProperty({ example: 61 })
  l: number;
}
