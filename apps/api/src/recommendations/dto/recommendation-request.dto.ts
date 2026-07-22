import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';

export enum RecommendationAction {
  CART = 'CART',
  BUY_NOW = 'BUY_NOW',
}

export class RecommendationRequestDto {
  @ApiProperty({
    description: '사용자가 선택한 상세 색상 ID',
    example: 25,
  })
  @IsInt()
  @Min(1)
  detailColorId: number;

  @ApiProperty({
    description: '추천 확인 후 실행할 작업',
    enum: RecommendationAction,
    example: RecommendationAction.CART,
  })
  @IsEnum(RecommendationAction)
  action: RecommendationAction;
}
