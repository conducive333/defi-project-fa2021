import { SubmissionController } from './submission.controller'
import { SubmissionService } from './submission.service'
import { RateLimiterModule } from '@api/rate-limiter'
import { Module } from '@nestjs/common'
import { FileModule } from '@api/file'

@Module({
  imports: [RateLimiterModule, FileModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
