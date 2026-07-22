import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { MockAiProvider } from './providers/mock-ai.provider';

@Module({
  controllers: [RecommendationsController],
  providers: [RecommendationsService, MockAiProvider],
})
export class RecommendationsModule {}
