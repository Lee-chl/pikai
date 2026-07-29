import { Controller, Post, Body } from '@nestjs/common';
import { PayService } from './pay.service';
import { CreatePayDto } from './dto/create-pay.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post()
  @ApiOperation({ summary: '결제' })
  create(@Body() createPayDto: CreatePayDto) {
    return this.payService.create(1, createPayDto);
  }

  @Post('page')
  @ApiOperation({ summary: '결제 페이지 조회' })
  findOne(
    @Body()
    body: {
      isCartOrder: boolean;
      selectedOnly?: boolean;
      buyItems?: {
        detailColorId: number;
        quantity: number;
      }[];
    },
  ) {
    // 임시 회원 id, 추후 수정
    return this.payService.findOne(
      1,
      body.isCartOrder,
      body.selectedOnly,
      body.buyItems,
    );
  }
}
