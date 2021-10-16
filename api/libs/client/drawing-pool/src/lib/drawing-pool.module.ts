import { DrawingPoolService } from './drawing-pool.service'
import { DrawingPoolController } from './drawing-pool.controller'
import { SubmissionModule } from '@api/client/submission'
import { RateLimiterModule } from '@api/rate-limiter'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule, SubmissionModule],
  controllers: [DrawingPoolController],
  providers: [DrawingPoolService],
})
export class DrawingPoolModule {}
