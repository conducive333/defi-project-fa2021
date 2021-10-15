import { Module } from '@nestjs/common'
import { DrawingPoolService } from './drawing-pool.service'
import { DrawingPoolController } from './drawing-pool.controller'

@Module({
  controllers: [DrawingPoolController],
  providers: [DrawingPoolService],
})
export class DrawingPoolModule {}
