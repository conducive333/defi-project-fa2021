import { AdminDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolModule } from '@api/drawing-pool'
import { SubmissionsModule } from '@api/submissions'
import { Module } from '@nestjs/common'

@Module({
  imports: [DrawingPoolModule, SubmissionsModule],
  controllers: [AdminDrawingPoolController],
})
export class AdminDrawingPoolModule {}
