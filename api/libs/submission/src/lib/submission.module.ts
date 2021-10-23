import { SubmissionService } from './submission.service'
import { Module } from '@nestjs/common'
import { FileModule } from '@api/file'

@Module({
  imports: [FileModule],
  exports: [SubmissionService],
})
export class SubmissionModule {}
