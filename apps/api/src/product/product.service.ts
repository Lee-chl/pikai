import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        color_main_image: createProductDto.color_main_image,
        color_detail_image: createProductDto.color_detail_image,
        name: createProductDto.name,
        hash_tag: createProductDto.hash_tag,
        price: createProductDto.price,
        is_sale: createProductDto.is_sale ?? false,
        category_id: createProductDto.category_id,
        brand_id: createProductDto.brand_id,
      },
    });
  }

  //상품 전체 조회
  async findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        category: true,
        brand: true,
        detail_color: true,
      },
    });
  }

  //상품 단일 조회
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        detail_color: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
