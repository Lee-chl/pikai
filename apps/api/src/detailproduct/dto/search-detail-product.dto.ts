import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SearchDetailProductDto {
  @ApiProperty({ example: '헤라', description: '브랜드 상품 이름' })
  @IsString()
  @MinLength(1)
  productName: string;
}
