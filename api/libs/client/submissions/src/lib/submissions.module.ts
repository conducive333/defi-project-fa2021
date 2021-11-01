import { ClientSubmissionsController } from './submissions.controller'
import { RateLimiterModule } from '@api/rate-limiter'
import { SubmissionsModule } from '@api/submissions'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule, SubmissionsModule],
  controllers: [ClientSubmissionsController],
})
export class ClientSubmissionsModule {}
