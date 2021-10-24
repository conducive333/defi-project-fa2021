import { DrawingPoolService } from './drawing-pool.service'
import { SubmissionModule } from '@api/submission'
import { Module } from '@nestjs/common'
import { FileModule } from '@api/file'

@Module({
  imports: [FileModule, SubmissionModule],
  providers: [DrawingPoolService],
  exports: [DrawingPoolService],
})
export class DrawingPoolModule {}
