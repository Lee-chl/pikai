import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from '../common/constants';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // login에서 sign() jwt token 만들기 위한 시크릿 정보
      secret: jwtConstants.secret,
      // access_token 은 짧게(1시간) , Refresh_token은 길게(14d)
      // 이건 access_token
      signOptions: { expiresIn: '14d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
