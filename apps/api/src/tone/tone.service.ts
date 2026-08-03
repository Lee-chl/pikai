import { Injectable } from '@nestjs/common';
import { PersonalColor } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToneService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: number) {
    let tone: PersonalColor | undefined;

    if (userId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          personal_color: true,
        },
      });
      tone = user?.personal_color;
    }

    let products = await this.prisma.sale.findMany({
      include: {
        detailColor: {
          include: {
            products: true,
          },
        },
      },
      orderBy: tone
        ? {
            [tone]: 'desc',
          }
        : {
            sale_count: 'desc',
          },
      take: 6,
    });

    if (tone && (products.length === 0 || !products[0][tone])) {
      tone = undefined; // 문구 변경을 위해 tone을 비움

      products = await this.prisma.sale.findMany({
        include: {
          detailColor: {
            include: {
              products: true,
            },
          },
        },
        orderBy: {
          sale_count: 'desc',
        },
        take: 6,
      });
    }

    return {
      products,
      title: tone ? `${tone} 상품 베스트` : '베스트 상품',
    };
  }
}
