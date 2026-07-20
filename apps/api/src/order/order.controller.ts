import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryDto } from 'src/common/query.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 가짜 유저 만들기 (유저 개발 전이므로)
  private mockUser = {
    id: 1,
    email: 'user@email.com',
    isAdmin: false,
  };

  @Get()
  @ApiOperation({ summary: '사용자 별 주문 목록 조회(최신순)' })
  findAll(@Query() query: QueryDto) {
    return this.orderService.findAll(query, this.mockUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 번호로 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @ApiOperation({ summary: '배송 상태 변경' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }
}
