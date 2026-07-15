import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ToneService } from './tone.service';
import { CreateToneDto } from './dto/create-tone.dto';
import { UpdateToneDto } from './dto/update-tone.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PersonalColor } from '@prisma/client';

@Controller('tone')
export class ToneController {
  constructor(private readonly toneService: ToneService) {}

  @Get()
  @ApiOperation({ summary: '톤 별 베스트' })
  findAll() {
    // 사용자 임시 데이터 (추후 auth 개발 후 수정)
    const mockUser = {
      id: 3,
      email: 'user@email.com',
      isAdmin: false,
      tone: PersonalColor.WARM,
    };
    return this.toneService.findAll(mockUser?.tone);
  }
}
