import { ClientDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolModule } from '@api/drawing-pool'
import { RateLimiterModule } from '@api/rate-limiter'
import { SubmissionsModule } from '@api/submissions'
import { ListingsModule } from '@api/listings'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    RateLimiterModule,
    ListingsModule,
    DrawingPoolModule,
    SubmissionsModule,
  ],
  controllers: [ClientDrawingPoolController],
})
export class ClientDrawingPoolModule {}
