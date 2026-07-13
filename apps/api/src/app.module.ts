import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RatingModule } from './rating/rating.module';
import { ToneModule } from './tone/tone.module';

@Module({
  imports: [RatingModule, ToneModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
