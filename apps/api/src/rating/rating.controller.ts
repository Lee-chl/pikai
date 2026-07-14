import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingEntity } from './entities/rating.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Rating } from '@prisma/client';

@Controller('rating')
@ApiTags('Rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @ApiOperation({ summary: '제품에 대한 별점 추가' })
  @ApiResponse({ type: RatingEntity })
  async create(@Body() createRatingDto: CreateRatingDto) {
    const create_rating: Rating =
      await this.ratingService.create(createRatingDto);
    return new RatingEntity(create_rating);
  }

  @Get()
  @ApiOperation({ summary: '사용자 별 사용자가 작성한 모든 별점 찾기' })
  getUserRatings() {
    // 가짜 유저 만들기 (유저 개발 전이므로)
    const mockUser = { id: 3, email: 'user@email.com', isAdmin: false };
    return this.ratingService.getUserRatings(mockUser.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.update(+id, updateRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratingService.remove(+id);
  }
}
