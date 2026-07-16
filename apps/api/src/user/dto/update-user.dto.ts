import { PersonalColor } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @ApiProperty({ example: '서울시 관악구' })
  address: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  @ApiProperty({ example: 101 })
  postal_code: number;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @ApiProperty({ example: '123123123' })
  password: string;

  @IsEnum(PersonalColor)
  @IsOptional()
  @ApiProperty({ example: PersonalColor.COOL })
  personal_color: PersonalColor;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  is_active: boolean;
}
