import { ClientDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolModule } from '@api/drawing-pool'
import { RateLimiterModule } from '@api/rate-limiter'
import { SubmissionModule } from '@api/submission'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule, DrawingPoolModule, SubmissionModule],
  controllers: [ClientDrawingPoolController],
})
export class ClientDrawingPoolModule {}
