import { AdminSubmissionsController } from './submissions.controller'
import { SubmissionsModule } from '@api/submissions'
import { Module } from '@nestjs/common'

@Module({
  imports: [SubmissionsModule],
  controllers: [AdminSubmissionsController],
})
export class AdminSubmissionsModule {}
