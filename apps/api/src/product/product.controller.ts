import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  //@Get()
  //findAll(
  //@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,

  //) {
  // return this.productService.findAll();
  //}
  //@ApiQuery({
  // name: 'page',
  // required: false,
  // type: Number,
  // example: 1,
  // description: '페이지 번호',
  //})
  //@Get()
  //findAll(@Query('page') page = '1') {
  // return this.productService.findAll(Number(page));
  //}
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  //@Get('category')
  //@ApiOperation({ summary: '카테고리별 상품 찾기' })
  //getCategoryProducts(@Query() query: QueryProductDto) {
  // return this.productService.getCategoryProducts(query);
  //}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
