import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PersonalColor } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 가짜 유저 만들기 (유저 개발 전이므로)
  private mockUser = {
    id: 1,
    email: 'user@email.com',
    isAdmin: false,
    tone: PersonalColor.WARM,
  };

  @Get(':id')
  @ApiOperation({ summary: '사용자 본인의 상세 정보 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id, this.mockUser.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '사용자 본인의 정보 수정(주소,사용 여부,퍼스널 컬러 등)',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto, this.mockUser.id);
  }
}
