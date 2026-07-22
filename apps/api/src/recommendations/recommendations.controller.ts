import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { RecommendationsService } from './recommendations.service';
import { PersonalColor } from '@prisma/client';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  // 인증 기능 개발 전 임시 사용자
  private mockUser = {
    id: 1,
    email: 'user@email.com',
    isAdmin: false,
    tone: PersonalColor.WARM,
  };

  @Post('color')
  recommendColor(@Body() dto: RecommendationRequestDto) {
    return this.recommendationsService.recommendColor(dto, this.mockUser.id);
  }
}
