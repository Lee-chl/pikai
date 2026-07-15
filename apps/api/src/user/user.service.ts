import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkPermissionId } from '../common/check-permission';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async findOne(id: number, currentUserId: number) {
    // 본인 id 만 조회 가능
    checkPermissionId(id, currentUserId);
    const existUser = await this.prisma.user.findUnique({ where: { id } });

    if (!existUser) {
      throw new NotFoundException(`[${id}] 유저가 없어요`);
    }

    const { password, ...result } = existUser;

    return result;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ) {
    // 유저 존재 확인
    await this.findOne(id, currentUserId);
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
    const { password, ...result } = user;

    return result;
  }
}
