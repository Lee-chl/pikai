import { Injectable } from '@nestjs/common';
import { CreateDetailproductDto } from './dto/create-detailproduct.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DetailproductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDetailproductDto: CreateDetailproductDto) {
    return await this.prisma.detailProduct.create({
      data: {
        color_name: createDetailproductDto.color_name,
        color_image: createDetailproductDto.color_image,
        stock: createDetailproductDto.stock,
        h: createDetailproductDto.h,
        s: createDetailproductDto.s,
        l: createDetailproductDto.l,
        product_id: createDetailproductDto.product_id,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    return await this.prisma.detailProduct.findMany({
      skip,
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const detailProduct = await this.prisma.detailProduct.findUnique({
      where: { id },
    });

    if (!detailProduct) {
      throw new Error(`상품을 찾을 수 없습니다.`);
    }

    return detailProduct;
  }
}
