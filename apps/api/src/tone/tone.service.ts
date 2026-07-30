import { Injectable } from '@nestjs/common';
import { PersonalColor } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToneService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tone?: PersonalColor) {
    let products;
    let title = '베스트 상품';

    if (tone) {
      products = await this.prisma.sale.findMany({
        include: {
          detailColor: {
            include: {
              products: true,
            },
          },
        },
        orderBy: {
          [tone]: 'desc',
        },
        take: 6,
      });

      title = `${tone} 상품 베스트`;
    } else {
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
      title,
    };
  }
}
