import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingEntity } from './entities/rating.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PersonalColor, Rating } from '@prisma/client';
import { QueryDto } from '../common/query.dto';

@Controller('rating')
@ApiTags('Rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}
  // 가짜 유저 만들기 (유저 개발 전이므로)
  private mockUser = {
    id: 1,
    email: 'user@email.com',
    isAdmin: false,
    tone: PersonalColor.WARM,
  };

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
  getUserRatings(@Query() query: QueryDto) {
    return this.ratingService.getUserRatings(this.mockUser.id, query);
  }

  @Get('/comp')
  @ApiOperation({ summary: '비교 제품들 가져오기' })
  getCompRatings() {
    return this.ratingService.getCompRatings(this.mockUser.id);
  }

  @Get('/comp/:id')
  @ApiOperation({ summary: '비교 제품 가져오기' })
  getCompRating(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getCompRating(id);
  }

  @Get(':id')
  @ApiOperation({ summary: '별점 하나 가져오기' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '별점 하나 수정하기 (비교 제품 여부와 별점 수정)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingService.update(id, updateRatingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '별점 상품 삭제하기' })
  remove(@Param('id') id: string) {
    return this.ratingService.remove(+id);
  }
}
