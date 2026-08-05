import { IsInt, IsString } from 'class-validator';

export class CompletePayDto {
  @IsString()
  paymentKey: string;

  @IsString()
  orderId: string;

  @IsInt()
  amount: number;
}
