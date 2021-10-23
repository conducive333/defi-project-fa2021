import { DrawingPoolService } from './drawing-pool.service'
import { SubmissionModule } from '@api/submission'
import { Module } from '@nestjs/common'

@Module({
  imports: [SubmissionModule],
  exports: [DrawingPoolService],
})
export class DrawingPoolModule {}
