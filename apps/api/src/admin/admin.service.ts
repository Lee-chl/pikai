import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
