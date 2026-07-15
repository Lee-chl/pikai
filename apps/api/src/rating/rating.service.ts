import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createRatingDto: CreateRatingDto) {
    // 이미 등록된 별점인지 와 상품과 유저가 있는 지 확인
    const [existRating, detail_color, user] = await Promise.all([
      this.prisma.rating.findUnique({
        where: {
          detail_color_id_user_id: {
            detail_color_id: createRatingDto.detail_color_id,
            user_id: createRatingDto.user_id,
          },
        },
      }),
      this.prisma.detailColor.findUnique({
        where: { id: createRatingDto.detail_color_id },
      }),
      this.prisma.user.findUnique({ where: { id: createRatingDto.user_id } }),
    ]);

    if (existRating) {
      throw new ConflictException(`해당 제품의 별점이 이미 존재합니다.}`);
    }

    if (!detail_color) {
      throw new NotFoundException(
        `${createRatingDto.detail_color_id}은 존재 하지 않은 제품 컬러입니다.`,
      );
    }
    if (!user) {
      throw new NotFoundException(
        `${createRatingDto.user_id}는 존재하지 않는 유저입니다.`,
      );
    }

    return this.prisma.rating.create({ data: createRatingDto });
  }

  async getUserRatings(userId: number) {
    // 사용자가 있는지 체크
    const existUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existUser) {
      throw new NotFoundException(`[${userId}] 유저가 없습니다.`);
    }
    return this.prisma.rating.findMany({
      where: { user_id: userId },
      include: {
        detail_color: true,
      },
      orderBy: {
        // true = 1, false = 0
        // true가 크므로 맨 위로 정렬
        is_comp: 'desc',
      },
    });
  }

  async getCompRatings(userId: number) {
    // user 확인
    const existUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existUser) {
      throw new NotFoundException(`[${userId}]가 없어요`);
    }
    const compRatings = await this.prisma.rating.findMany({
      where: {
        user_id: userId,
        is_comp: true,
      },
      include: {
        detail_color: true,
      },
    });

    if (!compRatings) {
      throw new NotFoundException(
        `[${userId}]가 가진 별점 비교 데이터가 없습니다.`,
      );
    }

    return compRatings;
  }

  async getCompRating(id: number) {
    const compRatings = await this.prisma.rating.findFirst({
      where: {
        id,
        is_comp: true,
      },
      include: {
        detail_color: true,
      },
    });

    if (!compRatings) {
      throw new NotFoundException(`[${id}] 별점 비교 데이터가 없습니다.`);
    }

    return compRatings;
  }

  async findOne(id: number) {
    const existRating = await this.prisma.rating.findUnique({
      where: { id },
      include: { detail_color: true },
    });
    if (!existRating) {
      throw new NotFoundException(`[${id}] 해당 별점이 존재하지 않아요`);
    }
    return existRating;
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    // 컬러 제품이 있는 지 확인
    const existRating = await this.prisma.rating.findUnique({
      where: {
        id,
      },
      include: {
        detail_color: true,
      },
    });

    if (!existRating) {
      throw new NotFoundException(`[${id}] 해당 별점이 존재하지 않아요`);
    }

    return this.prisma.rating.update({
      where: { id },
      data: updateRatingDto,
    });
  }

  async remove(id: number) {
    // 컬러 제품이 있는 지 확인
    const existRating = await this.prisma.rating.findUnique({
      where: {
        id,
      },
      include: {
        detail_color: true,
      },
    });

    if (!existRating) {
      throw new NotFoundException(`[${id}] 해당 별점이 존재하지 않아요`);
    }

    await this.prisma.rating.delete({ where: { id } });
    return { del: id };
  }
}
