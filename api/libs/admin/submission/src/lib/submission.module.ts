import { AdminSubmissionController } from './submission.controller'
import { SubmissionModule } from '@api/submission'
import { Module } from '@nestjs/common'

@Module({
  imports: [SubmissionModule],
  controllers: [AdminSubmissionController],
})
export class AdminSubmissionModule {}
