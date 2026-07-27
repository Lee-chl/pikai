import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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

  @Get()
  @ApiOperation({ summary: '결제 페이지 조회' })
  findOne(
    @Query('isCartOrder') isCartOrder: boolean,
    @Query('detailColorId') detailColorId?: number,
    @Query('quantity') quantity?: number,
  ) {
    // 임시 회원 id, 추후 수정
    return this.payService.findOne(
      1,
      isCartOrder,
      Number(detailColorId),
      Number(quantity),
    );
  }
}
