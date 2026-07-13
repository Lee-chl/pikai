import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { UserModule } from './user/user.module';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [UserModule, PayModule],
=======
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [PrismaModule, ProductModule, CartModule, OrderModule],
>>>>>>> 1f4385e3e4b5c2904161fe1a9140a70c9ade2930
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
