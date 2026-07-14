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

  getUserRatings(userId: number) {
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

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
