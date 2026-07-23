import { Injectable } from '@nestjs/common';
import { PersonalColor } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ToneService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tone?: PersonalColor) {
    if (!tone) {
      return this.prisma.sale.findMany({
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
    } else {
      return this.prisma.sale.findMany({
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
    }
  }
}
