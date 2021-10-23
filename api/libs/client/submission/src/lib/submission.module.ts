import { SubmissionController } from './submission.controller'
import { RateLimiterModule } from '@api/rate-limiter'
import { SubmissionModule } from '@api/submission'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule, SubmissionModule],
  controllers: [SubmissionController],
})
export class ClientSubmissionModule {}
