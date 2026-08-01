import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';
import { UpdateCartitemSelectDto } from './dto/update-cartitemselect.dto';
import { QueryCartDto } from './dto/query-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Cart
  @Post()
  @ApiOperation({
    summary: '장바구니 생성',
    description: '회원 id를 받아 장바구니를 생성합니다.',
  })
  createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.createCart(createCartDto);
  }

  // @ApiOperation({
  //   summary: '모든 회원의 장바구니 조회 (관리자)',
  //   description: '모든 장바구니를 조회합니다.',
  // })
  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  @Get()
  @ApiOperation({
    summary: '회원 장바구니 조회',
    description: '회원 ID를 이용해 장바구니와 장바구니 상품을 조회합니다.',
  })
  findCartByUserId(
    @Query() query: QueryCartDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.cartService.findCartByUserId(query, userId);
  }

  // CartItem

  @Post('items')
  @ApiOperation({
    summary: '장바구니 상품 추가',
    description:
      '상품을 장바구니에 추가합니다. 이미 있는 상품이면 수량을 증가시킵니다.',
  })
  createCartitem(@Body() createCartitemDto: CreateCartitemDto) {
    return this.cartService.createCartitem(createCartitemDto);
  }
  @Patch('items/:cartItemId')
  @ApiOperation({
    summary: '장바구니 상품 수량 수정',
    description: '장바구니 상품의 수량을 수정합니다.',
  })
  updateCartitem(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body() updateCartitemDto: UpdateCartitemDto,
  ) {
    return this.cartService.updateCartitem(cartItemId, updateCartitemDto);
  }

  @Patch('items/:cartItemId/select')
  @ApiOperation({
    summary: '장바구니 상품 선택 상태 수정',
    description: '상품의 선택 또는 선택 해제 상태를 수정합니다.',
  })
  updateCartitemSelect(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body() updateCartitemSelectDto: UpdateCartitemSelectDto,
  ) {
    return this.cartService.updateCartitemSelect(
      cartItemId,
      updateCartitemSelectDto,
    );
  }

  @Delete('items/:cartItemId')
  @ApiOperation({
    summary: '장바구니 상품 삭제',
    description: '장바구니에서 상품 하나를 삭제합니다.',
  })
  deleteCartitem(@Param('cartItemId', ParseIntPipe) cartItemId: number) {
    return this.cartService.deleteCartitem(cartItemId);
  }

  @Delete(':cartId/items')
  @ApiOperation({
    summary: '장바구니 비우기',
    description: '특정 장바구니에 담긴 모든 상품을 삭제합니다.',
  })
  clearCart(@Param('cartId', ParseIntPipe) cartId: number) {
    return this.cartService.clearCart(cartId);
  }
}
