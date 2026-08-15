import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePayDto } from './dto/create-pay.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuyItem, PayItemType } from './pay.type';
import { CompletePayDto } from './dto/complete-pay.dto';

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

  // 상품 가격(할인가)
  private getSalePrice(price: number): number {
    return Math.floor(price * 0.9);
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
          order_status: 'AWAITING',
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

        if (!product) {
          throw new NotFoundException('상품을 찾을 수 없습니다.');
        }

        await tx.orderItem.create({
          data: {
            order_id: order.id,
            detail_color_id: item.detail_color_id,
            quantity: item.quantity,
            price: this.getSalePrice(product.products.price),
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

      const cart = await tx.cart.findUnique({
        where: {
          userId,
        },
      });

      if (!cart) {
        throw new NotFoundException('장바구니를 찾을 수 없습니다.');
      }

      //장바구니, 바로구매에 맞게 결제 후 제품 삭제
      if (!createPayDto.isCartOrder) {
        await tx.cartItem.deleteMany({
          where: {
            cart_id: cart.id,
            is_now: true,
            detail_color_id: {
              in: createPayDto.items.map((item) => item.detail_color_id),
            },
          },
        });
      } else if (createPayDto.selectedOnly) {
        await tx.cartItem.deleteMany({
          where: {
            cart_id: cart.id,
            detail_color_id: {
              in: createPayDto.items.map((item) => item.detail_color_id),
            },
          },
        });
      } else {
        await tx.cartItem.deleteMany({
          where: {
            cart_id: cart.id,
            is_now: false,
            detail_color_id: {
              in: createPayDto.items.map((item) => item.detail_color_id),
            },
          },
        });
      }

      return order;
    });
  }

  async completePay(dto: CompletePayDto) {
    const { paymentKey, orderId, amount } = dto;
    const secretKey = `${process.env.TOSS_SECRET_KEY}`;

    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    const tossRes = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      },
    );

    const paymentData = await tossRes.json();

    if (!tossRes.ok) {
      throw new BadRequestException(
        paymentData.message || '결제 승인에 실패했습니다.',
      );
    }

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        payment: paymentData.method || 'CARD',
        order_status: 'PAYCOMPLETED',
      },
    });
  }
}
