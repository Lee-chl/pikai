import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiQuery } from '@nestjs/swagger';
import { SearchDetailProductDto } from './dto/search-detail-product.dto';
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

  @Get('search')
  @ApiOperation({ summary: '상품 검색' })
  searchProductByName(@Query() query: SearchDetailProductDto) {
    return this.detailproductService.searchProductByName(query);
  }
}
