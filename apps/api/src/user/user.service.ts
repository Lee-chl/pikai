import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { checkPermissionId } from '../common/check-permission';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  async update(updateUserDto: UpdateUserDto, currentUserId: number) {
    // 현재 회원 조회
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!currentUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 변경하는 경우 기존 비밀번호 일치 확인
    if (updateUserDto.current_password && updateUserDto.password) {
      if (updateUserDto.current_password !== currentUser.password) {
        throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
      }
    }

    const { current_password, ...data } = updateUserDto;

    const user = await this.prisma.user.update({
      where: { id: currentUserId },
      data,
    });
    const { password, ...result } = user;

    return result;
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    // 한달 전 날짜 먼저 구하기
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.prisma.user.findFirst({
      where: {
        email,
        OR: [
          { is_active: true },
          {
            is_active: false,
            update_at: {
              gte: oneMonthAgo,
            },
          },
        ],
      },
    });
  }
}
