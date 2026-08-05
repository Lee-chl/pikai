import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PayService } from './pay.service';
import { CreatePayDto } from './dto/create-pay.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';
import { CompletePayDto } from './dto/complete-pay.dto';

@Controller('pay')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Post()
  @ApiOperation({ summary: '결제' })
  create(
    @Body() createPayDto: CreatePayDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.payService.create(userId, createPayDto);
  }

  @Post('complete')
  async completePay(@Body() dto: CompletePayDto) {
    return await this.payService.completePay(dto);
  }
}
