import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { DetailproductService } from './detailproduct.service';

@Controller('detailproduct')
export class DetailproductController {
  constructor(private readonly detailproductService: DetailproductService) {}

  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: '페이지 번호',
  })
  @Get()
  findAll(@Query('page') page = '1') {
    return this.detailproductService.findAll(Number(page));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detailproductService.findOne(id);
  }
}
