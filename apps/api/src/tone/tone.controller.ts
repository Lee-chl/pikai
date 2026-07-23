import { Controller, Get } from '@nestjs/common';
import { ToneService } from './tone.service';
import { ApiOperation } from '@nestjs/swagger';
import { PersonalColor } from '@prisma/client';

@Controller('tone')
export class ToneController {
  constructor(private readonly toneService: ToneService) {}

  @Get()
  @ApiOperation({ summary: '톤 별 베스트' })
  async findAll() {
    // 사용자 임시 데이터 (추후 auth 개발 후 수정)
    const mockUser = {
      id: 3,
      email: 'user@email.com',
      isAdmin: false,
      tone: PersonalColor.COOL,
    };

    const products = await this.toneService.findAll(mockUser?.tone);

    let title = '베스트 상품';
    if (!mockUser.isAdmin && mockUser.tone) {
      title = `${mockUser.tone} 상품 베스트`;
    }
    return { products, title };
  }
}
