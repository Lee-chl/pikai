import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';
import { UpdateCartitemSelectDto } from './dto/update-cartitemselect.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Cart

  /**
   * 장바구니 생성
   */
  async createCart(createCartDto: CreateCartDto) {
    const { userId } = createCartDto;

    // 회원이 실제로 존재하는지 확인
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`ID가 ${userId}인 회원을 찾을 수 없습니다.`);
    }

    // userId가 @unique이므로 기존 장바구니 중복 확인
    const existingCart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (existingCart) {
      throw new ConflictException('해당 회원의 장바구니가 이미 존재합니다.');
    }

    return this.prisma.cart.create({
      data: {
        userId,
      },
      include: {
        user: true,
        cartItems: true,
      },
    });
  }

  /**
   * 전체 장바구니 조회
   * 관리자용
   */
  async findAll() {
    return this.prisma.cart.findMany({
      include: {
        user: true,

        cartItems: {
          include: {
            detailColor: true,
          },
        },
      },

      orderBy: {
        id: 'desc',
      },
    });
  }

  /**
   * 회원 ID로 장바구니 조회
   */
  async findCartByUserId(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        user: true,

        cartItems: {
          include: {
            detailColor: true,
          },

          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(
        `userId가 ${userId}인 회원의 장바구니를 찾을 수 없습니다.`,
      );
    }

    return cart;
  }

  // CartItem

  //장바구니 상품 추가
  //같은 장바구니에 같은 DetailProduct가 이미 있으면
  //새로운 행을 만들지 않고 quantity를 증가시킵니다.

  async createCartitem(createCartitemDto: CreateCartitemDto) {
    const { cart_id, detail_color_id, quantity, price } = createCartitemDto;

    // 장바구니 존재 여부 확인
    const cart = await this.prisma.cart.findUnique({
      where: {
        id: cart_id,
      },
    });

    if (!cart) {
      throw new NotFoundException(
        `ID가 ${cart_id}인 장바구니를 찾을 수 없습니다.`,
      );
    }

    // DetailProduct 존재 여부 확인
    const detailColor = await this.prisma.detailProduct.findUnique({
      where: {
        id: detail_color_id,
      },
    });

    if (!detailColor) {
      throw new NotFoundException(
        `ID가 ${detail_color_id}인 상품 옵션을 찾을 수 없습니다.`,
      );
    }

    //schema.prisma의 아래 제약조건을 사용합니다.
    //@@unique([cart_id, detail_color_id])
    //Prisma에서는 복합 unique 이름이
    //cart_id_detail_color_id로 생성됩니다.

    return this.prisma.cartItem.upsert({
      where: {
        cart_id_detail_color_id: {
          cart_id,
          detail_color_id,
        },
      },

      // 이미 담긴 상품이면 수량 증가
      update: {
        quantity: {
          increment: quantity,
        },
        is_selected: true,
      },

      // 처음 담는 상품이면 새로 생성
      create: {
        cart_id,
        detail_color_id,
        quantity,
        price,
      },

      include: {
        cart: true,
        detailColor: true,
      },
    });
  }

  /**
   * 장바구니 상품 수량 수정
   */
  async updateCartitem(
    cartItemId: number,
    updateCartItemDto: UpdateCartitemDto,
  ) {
    await this.findCartitemById(cartItemId);

    return this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },

      data: {
        quantity: updateCartItemDto.quantity,
      },

      include: {
        detailColor: true,
      },
    });
  }

  /**
   * 장바구니 상품 선택 또는 선택 해제
   */
  async updateCartitemSelect(
    cartItemId: number,
    updateCartItemSelectDto: UpdateCartitemSelectDto,
  ) {
    await this.findCartitemById(cartItemId);

    return this.prisma.cartItem.update({
      where: {
        id: cartItemId,
      },

      data: {
        is_selected: updateCartItemSelectDto.is_selected,
      },

      include: {
        detailColor: true,
      },
    });
  }

  /**
   * 장바구니 상품 한 개 삭제
   */
  async deleteCartitem(cartItemId: number) {
    await this.findCartitemById(cartItemId);

    const deletedItem = await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return {
      message: '장바구니 상품이 삭제되었습니다.',
      deletedItem,
    };
  }

  /**
   * 특정 장바구니의 모든 상품 삭제
   *
   * Cart는 삭제하지 않고 CartItem만 삭제합니다.
   */
  async clearCart(cartId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (!cart) {
      throw new NotFoundException(
        `ID가 ${cartId}인 장바구니를 찾을 수 없습니다.`,
      );
    }

    const result = await this.prisma.cartItem.deleteMany({
      where: {
        cart_id: cartId,
      },
    });

    return {
      message: '장바구니의 모든 상품이 삭제되었습니다.',
      deletedCount: result.count,
    };
  }

  /**
   * CartItem 존재 여부 확인용 내부 메서드
   */
  private async findCartitemById(cartItemId: number) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        `ID가 ${cartItemId}인 장바구니 상품을 찾을 수 없습니다.`,
      );
    }

    return cartItem;
  }
}
