import { AdminDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolModule } from '@api/drawing-pool'
import { SubmissionModule } from '@api/submission'
import { Module } from '@nestjs/common'

@Module({
  imports: [DrawingPoolModule, SubmissionModule],
  controllers: [AdminDrawingPoolController],
})
export class AdminDrawingPoolModule {}
