import { CreateSubmissionDto } from './create-submission.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'
import 'multer'

export class CreateVideoSubmissionDto extends CreateSubmissionDto {
  @ApiProperty({ type: 'file' })
  readonly video: Express.Multer.File
}
