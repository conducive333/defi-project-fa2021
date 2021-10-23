import { ClientDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolModule } from '@api/drawing-pool'
import { RateLimiterModule } from '@api/rate-limiter'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule, DrawingPoolModule],
  controllers: [ClientDrawingPoolController],
})
export class ClientDrawingPoolModule {}
