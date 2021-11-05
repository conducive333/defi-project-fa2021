import { SubmissionsService } from './submissions.service'
import { Module } from '@nestjs/common'
import { FileModule } from '@api/file'

@Module({
  imports: [FileModule],
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
