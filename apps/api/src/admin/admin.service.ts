import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDetailProductDto } from './dto/create-detailproduct.dto';
import { UpdateDetailProductDto } from './dto/update-detailproduct.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 상품 관련
  // Product

  async create(createAdminDto: CreateAdminDto) {
    const brand = await this.prisma.brand.findFirst({
      where: {
        name: createAdminDto.brand_name,
      },
    });

    let brandId: number;

    if (brand) {
      brandId = brand.id;
    } else {
      const newBrand = await this.prisma.brand.create({
        data: {
          name: createAdminDto.brand_name,
        },
      });

      brandId = newBrand.id;
    }

    const category = await this.prisma.category.findFirst({
      where: {
        name: createAdminDto.category_name,
      },
    });

    let categoryId: number;

    if (category) {
      categoryId = category.id;
    } else {
      const newCategory = await this.prisma.category.create({
        data: {
          name: createAdminDto.category_name,
        },
      });

      categoryId = newCategory.id;
    }

    return this.prisma.product.create({
      data: {
        color_main_image: createAdminDto.color_main_image,
        color_detail_image: createAdminDto.color_detail_image,
        name: createAdminDto.name,
        price: createAdminDto.price,
        hash_tag: createAdminDto.hash_tag,

        brand_id: brandId,
        category_id: categoryId,
      },
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 브랜드
    let brandId = product.brand_id;

    if (updateAdminDto.brand_name) {
      const brand = await this.prisma.brand.findFirst({
        where: {
          name: updateAdminDto.brand_name,
        },
      });

      if (brand) {
        brandId = brand.id;
      } else {
        const newBrand = await this.prisma.brand.create({
          data: {
            name: updateAdminDto.brand_name,
          },
        });

        brandId = newBrand.id;
      }
    }

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        color_main_image: updateAdminDto.color_main_image,
        color_detail_image: updateAdminDto.color_detail_image,
        name: updateAdminDto.name,
        price: updateAdminDto.price,
        hash_tag: updateAdminDto.hash_tag,
        brand_id: brandId,
      },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        brand: true,
        category: true,
        detail_color: true,
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return product;
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  // 상품 옵션 관련
  // DetailProduct

  async createDetailProduct(
    productId: number,
    createDetailProductDto: CreateDetailProductDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
    return this.prisma.detailProduct.create({
      data: {
        product_id: productId,
        color_name: createDetailProductDto.color_name,
        color_image: createDetailProductDto.color_image,
        stock: createDetailProductDto.stock,
        h: createDetailProductDto.h,
        s: createDetailProductDto.s,
        l: createDetailProductDto.l,
      },
    });
  }

  async updateDetailProduct(
    id: number,
    updateDetailProductDto: UpdateDetailProductDto,
  ) {
    const detailProduct = await this.prisma.detailProduct.findUnique({
      where: {
        id,
      },
    });

    if (!detailProduct) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    return this.prisma.detailProduct.update({
      where: {
        id,
      },
      data: updateDetailProductDto,
    });
  }

  async findDetailProducts(productId: number) {
    const product = await this.prisma.detailProduct.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return this.prisma.detailProduct.findMany({
      where: {
        product_id: productId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async removeDetailProduct(id: number) {
    const detailProduct = await this.prisma.detailProduct.findUnique({
      where: {
        id,
      },
    });

    if (!detailProduct) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    return this.prisma.detailProduct.delete({
      where: {
        id,
      },
    });
  }
}
