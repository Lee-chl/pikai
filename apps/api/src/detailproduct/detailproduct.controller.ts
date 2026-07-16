import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DetailproductService } from './detailproduct.service';
import { CreateDetailproductDto } from './dto/create-detailproduct.dto';
import { UpdateDetailproductDto } from './dto/update-detailproduct.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('detailproduct')
export class DetailproductController {
  constructor(private readonly detailproductService: DetailproductService) {}

  @Post()
  create(@Body() createDetailproductDto: CreateDetailproductDto) {
    return this.detailproductService.create(createDetailproductDto);
  }

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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetailproductDto: UpdateDetailproductDto,
  ) {
    return this.detailproductService.update(+id, updateDetailproductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailproductService.remove(+id);
  }
}
