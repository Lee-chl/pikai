import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PayService } from './pay.service';
import { CreatePayDto } from './dto/create-pay.dto';
import { UpdatePayDto } from './dto/update-pay.dto';
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
  findAll() {
    return this.payService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayDto: UpdatePayDto) {
    return this.payService.update(+id, updatePayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payService.remove(+id);
  }
}
