import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [UserModule, PayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
