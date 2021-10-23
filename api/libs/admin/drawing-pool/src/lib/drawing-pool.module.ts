import { AdminDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolModule } from '@api/drawing-pool'
import { Module } from '@nestjs/common'

@Module({
  imports: [DrawingPoolModule],
  controllers: [AdminDrawingPoolController],
})
export class AdminDrawingPoolModule {}
