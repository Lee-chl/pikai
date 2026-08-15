import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateDetailProductDto } from './dto/update-detailproduct.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/jwt-auth/admin.guard';
import { CreateDetailProductDto } from './dto/create-detailproduct.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 상품 관련
  // Product

  @Post()
  @ApiOperation({ summary: '관리자 상품 추가' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '상품 수정' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Get()
  @ApiOperation({ summary: '등록된 상품 목록' })
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.adminService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 상품 조회' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '상품 삭제' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  // 상품 옵션 관련
  // DetailProduct

  @Post(':productId/detail')
  @ApiOperation({ summary: '관리자 상품 옵션 추가' })
  createDetailProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createDetailProductDto: CreateDetailProductDto,
  ) {
    return this.adminService.createDetailProduct(
      productId,
      createDetailProductDto,
    );
  }

  @Patch('detail/:id')
  @ApiOperation({ summary: '상품 옵션 수정' })
  updateDetailProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDetailProduct: UpdateDetailProductDto,
  ) {
    return this.adminService.updateDetailProduct(id, updateDetailProduct);
  }

  @Get(':productId/detail')
  @ApiOperation({ summary: '상품 옵션 목록' })
  findDetailProducts(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    return this.adminService.findDetailProducts(
      productId,
      Number(page),
      Number(limit),
    );
  }

  @Delete('detail/:id')
  @ApiOperation({ summary: '상품 옵션 삭제' })
  removeDetailProduct(@Param('id') id: string) {
    return this.adminService.removeDetailProduct(+id);
  }
}
