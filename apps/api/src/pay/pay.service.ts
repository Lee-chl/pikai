import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePayDto } from './dto/create-pay.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PayService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateOrderId(): Promise<string> {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const date = `${year}${month}${day}`;

    //주문번호 생성
    const lastOrder = await this.prisma.order.findFirst({
      where: {
        id: {
          startsWith: date,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
    let sequence = 1;

    if (lastOrder) {
      sequence = Number(lastOrder.id.slice(-4)) + 1;
    }

    return `${date}${String(sequence).padStart(4, '0')}`;
  }

  async create(userId: number, createPayDto: CreatePayDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    if (!user.is_active) {
      throw new BadRequestException('탈퇴한 회원입니다.');
    }

    const orderId = await this.generateOrderId();

    return await this.prisma.$transaction(async (tx) => {
      if (createPayDto.items.length === 0) {
        throw new BadRequestException('주문 상품이 없습니다.');
      }

      //상품 확인
      for (const item of createPayDto.items) {
        const product = await tx.detailProduct.findUnique({
          where: {
            id: item.detail_color_id,
          },
          include: {
            products: true,
          },
        });
        if (!product) {
          throw new NotFoundException('상품을 찾을 수 없습니다.');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `${product.color_name}의 재고가 부족합니다.`,
          );
        }
      }

      const order = await tx.order.create({
        data: {
          id: orderId,
          payment: createPayDto.payment,
          delivery_info: createPayDto.delivery_info,
          postal_code: createPayDto.postal_code,
          delivery_inst: createPayDto.delivery_inst,
          phone_number: createPayDto.phone_number,
          recipient: createPayDto.recipient,
          user_id: userId,
        },
      });

      for (const item of createPayDto.items) {
        const product = await tx.detailProduct.findUnique({
          where: {
            id: item.detail_color_id,
          },
          include: {
            products: true,
          },
        });

        await tx.orderItem.create({
          data: {
            order_id: order.id,
            detail_color_id: item.detail_color_id,
            quantity: item.quantity,
            price: product!.products.price,
          },
        });

        //재고 감소
        await tx.detailProduct.update({
          where: {
            id: item.detail_color_id,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      if (createPayDto.isCartOrder) {
        const cart = await tx.cart.findUnique({
          where: {
            userId: userId,
          },
        });

        if (!cart) {
          throw new NotFoundException('장바구니를 찾을 수 없습니다.');
        }

        //장바구니에서 구매한 상품 삭제
        for (const item of createPayDto.items) {
          await tx.cartItem.deleteMany({
            where: {
              cart_id: cart.id,
              detail_color_id: item.detail_color_id,
            },
          });
        }
      }

      return order;
    });
  }

  async findOne(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        phone: true,
        postal_code: true,
        address: true,
        is_active: true,
      },
    });

    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    if (!user.is_active) {
      throw new BadRequestException('탈퇴한 회원입니다.');
    }

    return {
      recipient: user.name,
      phone_number: user.phone,
      postal_code: user.postal_code,
      delivery_info: user.address,
    };
  }
}
