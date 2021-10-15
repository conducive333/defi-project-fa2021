import { RateLimiterModule } from '@api/rate-limiter'
import { SubmissionService } from './submission.service'
import { SubmissionController } from './submission.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule],
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
