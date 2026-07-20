import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryDto } from 'src/common/query.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: QueryDto, userId: number) {
    const { page, limit } = query;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { user_id: userId },
        orderBy: { order_date: 'desc' },
        include: {
          orderItem: {
            orderBy: [
              { quantity: 'desc' },
              { price: 'desc' },
              { detail_color_id: 'asc' },
            ],
            include: {
              detailColor: {
                include: {
                  products: {
                    select: {
                      id: true,
                      name: true,
                      color_main_image: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where: { user_id: userId } }),
    ]);
    return { orders, total, page, limit, totalPage: Math.ceil(total / limit) };
  }

  getOrderItemNum(order_id: number) {
    return this.prisma.orderItem.count({ where: { order_id: order_id } });
  }

  async getOrderItem(orderId: number, userId: number) {
    const existOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existOrder) {
      throw new NotFoundException(`[${orderId}] 주문이 없습니다.`);
    }

    return await this.prisma.orderItem.findMany({
      where: { order_id: orderId },
      include: {
        detailColor: {
          select: {
            id: true,
            color_name: true,
            products: {
              select: {
                id: true,
                name: true,
                color_main_image: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    // 일단 있는 지 확인 추후 사용자 인증 개발 되면 해당 유저 인지 확인!
    const exist = await this.prisma.order.findUnique({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`[${id}] 해당하는 주문이 없어요`);
    }
    return exist;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
