import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  @ApiProperty({ example: OrderStatus.PAYCOMPLETED })
  order_status: OrderStatus;
}
